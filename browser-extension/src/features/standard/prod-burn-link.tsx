import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import ContextControlsItem from '@src/components/ContextControlsItem.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { $ } from '@src/utils/select-dom';

async function onTileReady(tile: PrunTile) {
  if (!tile.parameter) {
    return;
  }

  const site = sitesStore.getById(tile.parameter);
  if (!site) {
    return;
  }

  const props = {
    cmd: `XIT BURN ${getEntityNaturalIdFromAddress(site.address)}`,
  };
  const contextBar = await $(tile.frame, PrunCss.ContextControls.container);
  const fragmentApp = createFragmentApp(ContextControlsItem, props);
  if (contextBar.children[0]) {
    fragmentApp.before(contextBar.children[0]);
  } else {
    fragmentApp.appendTo(contextBar);
  }
}

export function init() {
  tiles.observe('PROD', onTileReady);
}

void features.add({
  id: 'prod-burn-link',
  init,
});
