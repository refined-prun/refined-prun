import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import descendantPresent from '@src/utils/descendant-present';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import BuildingCountSection from './BuildingCountSection.vue';

async function onTileReady(tile: PrunTile) {
  const naturalId = tile.parameter;
  if (!naturalId) {
    return;
  }

  const container = await descendantPresent(tile.frame, PrunCss.Site.container);
  createFragmentApp(BuildingCountSection, { naturalId }).appendTo(container);
}

export function init() {
  tiles.observe('BS', onTileReady);
}

void features.add({
  id: 'bs-building-list',
  init,
});
