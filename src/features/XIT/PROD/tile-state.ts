import { createTileStateHook } from '@src/store/user-data-tiles';

export const useTileState = createTileStateHook({
  production: true,
  queue: true,
  inactive: true,
  notqueued: true,
  headers: true,
  expandPlanets: [] as string[],
  expandInfo: [] as string[],
});
