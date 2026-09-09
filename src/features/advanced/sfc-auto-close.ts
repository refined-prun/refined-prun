import { closeTileWindow } from '@src/infrastructure/prun-ui/utils/close-prun-window';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.frame, C.ActionFeedback.success), () => closeTileWindow(tile));
}

function init() {
  tiles.observe('SFC', onTileReady);
}

features.add(import.meta.url, init, 'SFC: Auto-closes the window on success.');
