import { getTileState as getBaseTileState } from '@src/store/user-data-tiles';

export interface TileState extends UserData.TileState {
  hideOrdersInfo: Map<string, number[]>;
}

export function getTileState(tile: PrunTile) {
  return computed(() => getBaseTileState(tile) as TileState);
}
