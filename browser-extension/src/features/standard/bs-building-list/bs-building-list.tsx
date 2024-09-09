import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import descendantPresent from '@src/utils/descendant-present';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { widgetAppend } from '@src/utils/vue-mount';
import BuildingCountSection from './BuildingCountSection.vue';

async function onTileReady(tile: PrunTile) {
  const naturalId = tile.parameter;
  if (!naturalId) {
    return;
  }

  const container = await descendantPresent(tile.frame, PrunCss.Site.container);
  widgetAppend(container, BuildingCountSection, { naturalId });
}

export function init() {
  tiles.observe('BS', onTileReady);
}

void features.add({
  id: 'bs-building-list',
  init,
});
