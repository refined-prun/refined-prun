import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { clickElement } from '@src/util';
import { waitActionFeedback } from '@src/infrastructure/prun-ui/utils/action-feedback';
import { mirrorConfirmationOverlay } from '@src/infrastructure/prun-ui/utils/mirror-confirmation-overlay';
import { showErrorOverlay, showProgressOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import { onNodeDisconnected } from '@src/utils/on-node-disconnected';
import css from '@src/utils/css-utils.module.css';

export async function fulfillCondition(
  target: Element,
  contract: PrunApi.Contract,
  condition: PrunApi.ContractCondition,
  autoClose: boolean,
) {
  const targetBody = target.closest(`.${C.TileFrame.body}`);
  const targetAnchor = target.closest(`.${C.TileFrame.anchor}`);
  if (!targetBody || !targetAnchor || _$(targetBody, C.ActionFeedback.overlay)) {
    return;
  }
  const showError = (message: string) => {
    if (targetAnchor.isConnected) {
      showErrorOverlay(targetAnchor, message);
    }
  };
  const dismissProgress = showProgressOverlay(target);
  const done = ref(false);
  onNodeDisconnected(targetAnchor, () => {
    done.value = true;
    dismissProgress();
  });
  try {
    const command = `CONT ${contract.localId}`;
    // Force a fresh buffer so we never reuse a contract window the user already has open.
    const bufferWindow = await showBuffer(command, {
      force: true,
      autoSubmit: true,
      autoClose: true,
      closeWhen: done,
    });
    if (done.value) {
      return;
    }

    // Resolve the tile from the window we just created, not via tiles.find,
    // which could return another already-open CONT window for the same contract.
    const body = _$(bufferWindow, C.Window.body);
    const tile = body ? tiles.findByContainer(body)[0] : undefined;
    if (tile === undefined) {
      showError('Failed to open contract buffer.');
      return;
    }

    // Wait for the conditions table to render.
    await $(tile.anchor, 'tbody');
    if (done.value) {
      return;
    }

    // The CONT table renders conditions in their array order.
    const idx = contract.conditions.findIndex(x => x.id === condition.id);
    if (idx < 0) {
      showError('Could not find condition in contract.');
      return;
    }

    const rows = _$$(tile.anchor, 'tr');
    // Skip the header row.
    const dataRows = rows.filter(x => _$$(x, 'td').length > 0);
    if (idx >= dataRows.length) {
      showError('Could not find condition row.');
      return;
    }

    const row = dataRows[idx];
    // The row is already matched to this condition by index, so its lone success
    // button is the fulfill button. Avoid matching on localized button text.
    const fulfillBtn = _$$(row, C.Button.success)[0];
    if (fulfillBtn === undefined) {
      showError('Cannot fulfill this condition right now.');
      return;
    }

    // Replace display:none with offscreen positioning so React processes events.
    const windowEl = bufferWindow as HTMLElement;
    windowEl.classList.remove(css.hidden);
    windowEl.style.position = 'fixed';
    windowEl.style.left = '-9999px';
    mirrorConfirmationOverlay(bufferWindow, targetBody, dismissProgress);
    await clickElement(fulfillBtn);
    await waitActionFeedback(tile.frame, {
      dismissSuccess: autoClose,
      dismissError: autoClose,
    });
  } catch (error) {
    showError(error instanceof Error ? error.message : 'Failed to fulfill contract condition.');
  } finally {
    dismissProgress();
    done.value = true;
  }
}
