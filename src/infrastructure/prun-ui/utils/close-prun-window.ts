export function closePrunWindow(window: Element | null | undefined) {
  if (!window) {
    return;
  }

  const close = L.Window.action.close();
  const button = _$$(window, C.Window.button).find(
    x => x.textContent === close,
  ) as HTMLButtonElement;
  button.click();
}

export function closeTileWindow(tile: PrunTile) {
  if (!tile.docked) {
    closePrunWindow(tile.window);
  }
}
