import { clickElement } from '@src/util';

export async function closePrunWindow(window: Element | null | undefined) {
  if (!window) {
    return;
  }

  const close = L.Window.action.close();
  const button = _$$(window, C.Window.button).find(x => x.textContent === close);
  await clickElement(button);
}

export async function closeTileWindow(tile: PrunTile) {
  if (!tile.docked) {
    await closePrunWindow(tile.window);
  }
}
