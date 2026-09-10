import { clickElement } from '@src/util';
import { waitNodeDisconnected } from '@src/utils/on-node-disconnected';

interface WaitActionFeedbackOptions {
  autoConfirm?: boolean;
  dismissSuccess?: boolean;
  dismissError?: boolean;
}

interface WaitActionFeedbackResult {
  result: 'success' | 'error' | 'cancel';
  message: string;
}

export async function waitActionFeedback(
  tileFrame: Element,
  options: WaitActionFeedbackOptions = {},
): Promise<WaitActionFeedbackResult> {
  options.autoConfirm ??= false;
  options.dismissSuccess ??= false;
  options.dismissError ??= false;

  const closed = waitNodeDisconnected(tileFrame);
  const overlay = await Promise.race([$(tileFrame, C.ActionFeedback.overlay), closed]);
  if (!overlay || !tileFrame.isConnected) {
    return { result: 'cancel', message: '' };
  }

  if (overlay.classList.contains(C.ActionConfirmationOverlay.container)) {
    if (options.autoConfirm) {
      const confirm = _$$(overlay, C.Button.btn)[1];
      if (confirm === undefined) {
        return { result: 'error', message: 'Confirmation overlay is missing confirm button.' };
      }
      await clickElement(confirm);
    }
    await waitNodeDisconnected(overlay);
    // Confirmation is replaced in the same render; no overlay means cancellation.
    if (!tileFrame.isConnected || !_$(tileFrame, C.ActionFeedback.overlay)) {
      return { result: 'cancel', message: '' };
    }
  }

  const outcome = await Promise.race([
    $(tileFrame, C.ActionFeedback.error),
    $(tileFrame, C.ActionFeedback.success),
    closed,
  ]);
  if (!outcome) {
    return { result: 'cancel', message: '' };
  }

  const result = outcome.classList.contains(C.ActionFeedback.success) ? 'success' : 'error';
  const text = _$(outcome, C.ActionFeedback.message)?.textContent ?? '';
  const dismiss = _$(outcome, C.ActionFeedback.dismiss)?.textContent;
  const message = (dismiss ? text.replace(dismiss, '') : text).trim();
  if (result === 'success' ? options.dismissSuccess : options.dismissError) {
    await clickElement(outcome);
  }
  await waitNodeDisconnected(outcome);
  return { result, message };
}
