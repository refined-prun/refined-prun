import { createTileStateHook } from '@src/store/user-data-tiles';

export const useTileState = createTileStateHook({
  production: true,
  queue: true,
  inactive: true,
  notqueued: true,
  headers: true,
  expand: [] as string[],
});
