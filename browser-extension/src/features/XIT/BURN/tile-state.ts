import { createTileStateHook } from '@src/store/user-data-tiles';

export const useTileState = createTileStateHook({
  red: true,
  yellow: true,
  green: true,
  inf: true,
  expand: [] as string[],
});
