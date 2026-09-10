import { clickElement, selectMaterialInMaterialSelector } from '@src/util';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { mirrorConfirmationOverlay } from '@src/infrastructure/prun-ui/utils/mirror-confirmation-overlay';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { waitNodeDisconnected } from '@src/utils/on-node-disconnected';
import { waitActionFeedback } from '@src/infrastructure/prun-ui/utils/action-feedback';
import {
  showConfirmationOverlay,
  showProgressOverlay,
} from '@src/infrastructure/prun-ui/tile-overlay';
import { watchUntil } from '@src/utils/watch';
import { cxosStore } from '@src/infrastructure/prun-api/data/cxos';
import { fxosStore } from '@src/infrastructure/prun-api/data/fxos';
import { refAnimationFrame } from '@src/utils/reactive-dom';

export async function deleteExchangeOrderFromClick(
  event: MouseEvent,
  orderId: string,
  screenCommand: 'CXOS' | 'FXOS',
) {
  event.preventDefault();
  event.stopPropagation();

  if (event.shiftKey) {
    return await deleteExchangeOrder(event.target as Element, orderId, screenCommand, true);
  }

  return await new Promise<boolean>(resolve => {
    showConfirmationOverlay(
      event,
      async () => {
        const success = await deleteExchangeOrder(
          event.target as Element,
          orderId,
          screenCommand,
          false,
        );
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
  autoClose: boolean,
) {
  orderId = orderId.toLowerCase();
  const dismissProgress = showProgressOverlay(target);

  const shouldClose = ref(false);
  const stopWatch = watch(shouldClose, value => {
    if (value) {
      dismissProgress();
      stopWatch();
    }
  });

  const isCX = screenCommand === 'CXOS';
  const window = await showBuffer(screenCommand, {
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
  if (isCX) {
    await setCxosFilters(window, orderId);
  }
  const button = await findOrderDeleteButton(window, orderId, orderCount);
  if (!button) {
    shouldClose.value = true;
    return false;
  }
  mirrorConfirmationOverlay(window, target, dismissProgress);
  try {
    await clickElement(button);
    const { result } = await waitActionFeedback(window, {
      dismissSuccess: autoClose,
      dismissError: autoClose,
    });
    return result === 'success';
  } finally {
    shouldClose.value = true;
  }
}

async function awaitBufferLoad(window: Element) {
  const loading = _$(window, C.Loading.loader);
  await waitNodeDisconnected(loading);
}

async function setCxosFilters(window: Element, orderId: string) {
  const order = cxosStore.getById(orderId);
  if (!order) {
    return;
  }
  const filters = _$$(window, C.ComExOrdersPanel.filter);
  if (filters.length === 0) {
    // FREE user, probably.
    return;
  }
  const materialSelector = _$(window, C.MaterialSelector.container);
  if (materialSelector) {
    await selectMaterialInMaterialSelector(materialSelector, order.material.ticker);
  }
  await clickFilter(L.OrderStatusLabel.FILLED());
  await clickFilter(
    order.type === 'BUYING' ? L.OrderTypeLabel.SELLING() : L.OrderTypeLabel.BUYING(),
  );

  async function clickFilter(button: string | undefined) {
    if (!button) {
      return;
    }
    const filter = filters
      .flatMap(x => _$$(x, C.RadioItem.value))
      .find(x => x.textContent === button);
    if (filter) {
      await clickElement(filter);
    }
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
