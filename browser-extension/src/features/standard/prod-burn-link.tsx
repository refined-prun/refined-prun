import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import descendantPresent from '@src/utils/descendant-present';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import ContextControlsItem from '@src/components/ContextControlsItem.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getPlanetNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';

async function onTileReady(tile: PrunTile) {
  if (!tile.parameter) {
    return;
  }

  if (!tile.firstActivation) {
    return;
  }

  const site = sitesStore.getByShortId(tile.parameter);
  if (!site) {
    return;
  }

  const props = {
    cmd: `XIT BURN ${getPlanetNaturalIdFromAddress(site.address)}`,
  };
  const contextBar = await descendantPresent(tile.frame, PrunCss.ContextControls.container);
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
