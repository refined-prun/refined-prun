import { createTileStateHook } from '@src/store/user-data-tiles';

export const useTileState = createTileStateHook({
  showBase: true,
  showShip: true,
  showWarehouse: true,
  showCx: true,
  showBaseWar: true,
});
