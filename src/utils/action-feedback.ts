import { clickElement } from '@src/util';

export async function waitActionFeedback(frame: Element): Promise<string | undefined> {
  const overlay = await $(frame, C.ActionFeedback.overlay);
  await waitActionProgress(overlay);
  if (overlay.classList.contains(C.ActionConfirmationOverlay.container)) {
    const confirm = _$$(overlay, C.Button.btn)[1];
    if (confirm === undefined) {
      return 'Confirmation overlay is missing confirm button';
    }
    await clickElement(confirm);
    await waitActionProgress(overlay);
  }
  if (overlay.classList.contains(C.ActionFeedback.success)) {
    await clickElement(overlay);
    return;
  }
  if (overlay.classList.contains(C.ActionFeedback.error)) {
    const message = _$(overlay, C.ActionFeedback.message)?.textContent;
    const dismiss = _$(overlay, C.ActionFeedback.dismiss)?.textContent;
    return dismiss ? message?.replace(dismiss, '') : message;
  }

  return 'Unknown action feedback overlay';
}

async function waitActionProgress(overlay: HTMLElement) {
  if (!overlay.classList.contains(C.ActionFeedback.progress)) {
    return;
  }
  await new Promise<void>(resolve => {
    const mutationObserver = new MutationObserver(() => {
      if (!overlay.classList.contains(C.ActionFeedback.progress)) {
        mutationObserver.disconnect();
        resolve();
      }
    });
    mutationObserver.observe(overlay, { attributes: true });
  });
}
