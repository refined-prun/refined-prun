import { createTileStateHook } from '@src/infrastructure/prun-api/data/tiles';

export interface TileState extends BaseTileState {
  activeSort?: string;
}

export const useTileState = createTileStateHook<TileState>({});
