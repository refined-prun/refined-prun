import { computed } from 'vue';
import { tilesStore } from '@src/infrastructure/prun-api/data/tiles';

export interface TileState extends BaseTileState {
  activeSort?: string;
}

export function getTileState(tile: PrunTile) {
  return computed(() => tilesStore.getTileState(tile) as TileState);
}
