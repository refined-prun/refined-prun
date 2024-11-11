import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import BuildingCountSection from './BuildingCountSection.vue';
import { $$ } from '@src/utils/select-dom';
import { subscribe } from '@src/utils/subscribe-async-generator';

function onTileReady(tile: PrunTile) {
  const naturalId = tile.parameter;
  if (!naturalId) {
    return;
  }

  subscribe($$(tile.anchor, PrunCss.Site.container), container => {
    createFragmentApp(BuildingCountSection, { naturalId }).appendTo(container);
  });
}

function init() {
  tiles.observe('BS', onTileReady);
}

features.add({
  id: 'bs-building-list',
  description: 'BS: Adds a building summary list.',
  init,
});
