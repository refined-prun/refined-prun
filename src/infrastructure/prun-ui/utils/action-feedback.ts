import { clickElement } from '@src/util';

export async function waitActionFeedback(frame: Element) {
  const overlay = await $(frame, C.ActionFeedback.overlay);
  if (overlay.classList.contains(C.ActionConfirmationOverlay.container)) {
    const confirm = _$$(overlay, C.Button.btn)[1];
    if (confirm === undefined) {
      return 'Confirmation overlay is missing confirm button';
    }
    await clickElement(confirm);
  }
  const outcome = await Promise.race([
    $(frame, C.ActionFeedback.error),
    $(frame, C.ActionFeedback.success),
  ]);
  if (outcome.classList.contains(C.ActionFeedback.success)) {
    await clickElement(outcome);
    return;
  }
  const message = _$(outcome, C.ActionFeedback.message)?.textContent;
  const dismiss = _$(outcome, C.ActionFeedback.dismiss)?.textContent;
  return dismiss ? message?.replace(dismiss, '') : message;
}
