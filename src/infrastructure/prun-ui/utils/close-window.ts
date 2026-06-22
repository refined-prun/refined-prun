import { clickElement } from '@src/util';

export async function closeWindow(window: HTMLElement | null | undefined) {
  if (!window) {
    return;
  }

  const close = L.Window.action.close();
  const button = _$$(window, C.Window.button).find(x => x.textContent === close);
  await clickElement(button);
}
