import { getTileState as getBaseTileState } from '@src/store/user-data-tiles';

export interface Scroll {
  top: number;
  left: number;
}

export interface TileState extends UserData.TileState {
  scroll?: Scroll;
}

export function getTileState(tile: PrunTile) {
  return computed(() => getBaseTileState(tile) as TileState);
}
