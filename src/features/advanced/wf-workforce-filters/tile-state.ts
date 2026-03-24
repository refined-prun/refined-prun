import { getTileState as getBaseTileState } from '@src/store/user-data-tiles';

export interface WorkforceFilter {
  workforce: string;
  value: boolean;
}

export interface TileState extends UserData.TileState {
  hideWorkforce: WorkforceFilter[];
}

export function getTileState(tile: PrunTile) {
  return computed(() => getBaseTileState(tile) as TileState);
}
