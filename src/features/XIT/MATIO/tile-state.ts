import { createTileStateHook } from '@src/store/user-data-tiles';

export const useTileState = createTileStateHook({
  mode: 'all' as 'all' | 'production' | 'workforce',
  expand: [] as string[],
});
