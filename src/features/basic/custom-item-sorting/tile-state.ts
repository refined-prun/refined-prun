import { getTileState as getBaseTileState } from '@src/store/user-data-tiles';

export interface TileState extends UserData.TileState {
  activeSort?: string;
  catSort: boolean;
  reverseSort: boolean;
}

export function getTileState(tile: PrunTile) {
  return computed(() => getBaseTileState(tile) as TileState);
}
