import { createTileStateHook } from '@src/infrastructure/prun-api/data/tiles';

export const useTileState = createTileStateHook({
  red: true,
  yellow: true,
  green: true,
  inf: true,
  expand: [] as string[],
});
