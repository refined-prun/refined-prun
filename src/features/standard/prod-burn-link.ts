import { createFragmentApp } from '@src/utils/vue-fragment-app';
import ContextControlsItem from '@src/components/ContextControlsItem.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';

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
  const contextBar = await $(tile.frame, C.ContextControls.container);
  const fragmentApp = createFragmentApp(ContextControlsItem, props);
  if (contextBar.children[0]) {
    fragmentApp.before(contextBar.children[0]);
  } else {
    fragmentApp.appendTo(contextBar);
  }
}

function init() {
  tiles.observe('PROD', onTileReady);
}

features.add(import.meta.url, init, 'PROD: Adds a XIT BURN link to the context bar.');
