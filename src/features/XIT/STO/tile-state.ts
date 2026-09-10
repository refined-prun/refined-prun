import { createTileStateHook } from '@src/store/user-data-tiles';

export const useTileState = createTileStateHook({
  expand: [] as string[],
});
