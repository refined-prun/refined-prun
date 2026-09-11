import { createTileStateHook } from '@src/store/user-data-tiles';

export type SortKey = 'ticker' | 'delta' | 'production' | 'consumption' | 'currencyDelta';

export const useTileState = createTileStateHook({
  sort: 'currencyDelta' as SortKey,
  desc: false,
});
