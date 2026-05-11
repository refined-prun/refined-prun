import { clickElement } from '@src/util';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { mirrorConfirmationOverlay } from '@src/infrastructure/prun-ui/utils/mirror-confirmation-overlay';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import onNodeDisconnected from '@src/utils/on-node-disconnected';
import { showConfirmationOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import ActionFeedbackProgress from '@src/components/ActionFeedbackProgress.vue';
import { watchUntil } from '@src/utils/watch';
import { cxosStore } from '@src/infrastructure/prun-api/data/cxos';
import { fxosStore } from '@src/infrastructure/prun-api/data/fxos';
import { refAnimationFrame } from '@src/utils/reactive-dom';

export async function deleteExchangeOrderFromClick(
  event: Event,
  orderId: string,
  screenCommand: 'CXOS' | 'FXOS',
) {
  event.preventDefault();
  event.stopPropagation();
  return await new Promise<boolean>(resolve => {
    showConfirmationOverlay(
      event,
      async () => {
        const success = await deleteExchangeOrder(event.target as Element, orderId, screenCommand);
        resolve(success);
      },
      { message: 'Delete this order?', confirmLabel: 'Delete' },
    );
  });
}

export async function deleteExchangeOrder(
  target: Element,
  orderId: string,
  screenCommand: 'CXOS' | 'FXOS',
) {
  orderId = orderId.toLowerCase();
  const dismissProgress = showManualProgressOverlay(target);

  const shouldClose = ref(false);
  const stopWatch = watch(shouldClose, value => {
    if (value) {
      dismissProgress();
      stopWatch();
    }
  });

  const isCX = screenCommand === 'CXOS';
  // FXOS doesn't support 9999 D:
  const window = await showBuffer(isCX ? `CXOS 9999` : screenCommand, {
    autoClose: true,
    closeWhen: shouldClose,
    force: true,
  });
  await watchUntil(() => (isCX ? cxosStore.fetched.value : fxosStore.fetched.value));
  const orderCount = (isCX ? cxosStore.all.value?.length : fxosStore.all.value?.length) ?? 0;
  if (orderCount === 0) {
    shouldClose.value = true;
    return false;
  }
  await awaitBufferLoad(window);
  const button = await findOrderDeleteButton(window, orderId, orderCount);
  if (!button) {
    shouldClose.value = true;
    return false;
  }
  mirrorConfirmationOverlay(window, target);
  await clickElement(button);
  const outcome = await awaitActionOutcome(window);
  onNodeDisconnected(outcome, () => {
    shouldClose.value = true;
  });
  return outcome.classList.contains(C.ActionFeedback.success);
}

function awaitActionOutcome(window: Element) {
  return new Promise<Element>(resolve => {
    const findOutcome = () =>
      _$(window, C.ActionFeedback.error) ?? _$(window, C.ActionFeedback.success);
    const existing = findOutcome();
    if (existing) {
      resolve(existing);
      return;
    }
    const observer = new MutationObserver(() => {
      const outcome = findOutcome();
      if (outcome) {
        observer.disconnect();
        resolve(outcome);
      }
    });
    observer.observe(window, { childList: true, subtree: true });
  });
}

function showManualProgressOverlay(target: Element) {
  const targetBody = target.closest(`.${C.TileFrame.body}`);
  if (!targetBody) {
    return () => {};
  }
  const before = new Set(Array.from(targetBody.children));
  const progressApp = createFragmentApp(ActionFeedbackProgress);
  progressApp.appendTo(targetBody);
  const manual = Array.from(targetBody.children).filter(x => !before.has(x));

  let dismissed = false;
  const dismiss = () => {
    if (dismissed) {
      return;
    }
    dismissed = true;
    progressApp.unmount();
    observer.disconnect();
  };

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const added of Array.from(mutation.addedNodes)) {
        if (
          added instanceof Element &&
          added.classList.contains(C.ActionFeedback.overlay) &&
          !manual.includes(added)
        ) {
          dismiss();
          return;
        }
      }
    }
  });
  observer.observe(targetBody, { childList: true });
  return dismiss;
}

async function awaitBufferLoad(window: Element) {
  const loading = _$(window, C.Loading.loader);
  if (loading) {
    await new Promise<void>(resolve => {
      onNodeDisconnected(loading, resolve);
    });
  }
}

async function findOrderDeleteButton(window: Element, orderId: string, orderCount: number) {
  const tbody = await $(window, 'tbody');
  await watchUntil(refAnimationFrame(tbody, x => x.children.length > 0));

  for (let i = 0; i < orderCount; i++) {
    let row = tbody.children[i] as HTMLElement | undefined;

    if (!row) {
      const loadMore = await $(window, C.EndlessScrollControl.loadMore);

      await watchUntil(
        refAnimationFrame(loadMore, x => !x.classList.contains(C.EndlessScrollControl.hidden)),
      );

      await clickElement(loadMore);
      await watchUntil(refAnimationFrame(tbody, x => i < x.children.length));

      row = tbody.children[i] as HTMLElement | undefined;
      if (!row) {
        break;
      }
    }

    const isMatch = getPrunId(row)?.startsWith(orderId);
    if (isMatch) {
      return await $(row, C.Button.danger);
    }
  }

  return undefined;
}
