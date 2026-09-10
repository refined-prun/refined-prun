import { createTileStateHook } from '@src/store/user-data-tiles';

export const useTileState = createTileStateHook({
  wv: false,
  total: false,
  // Codes of the exchanges whose value column is shown.
  cx: [] as string[],
});
