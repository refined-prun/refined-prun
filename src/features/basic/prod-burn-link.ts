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

  const contextBar = await $(tile.frame, C.ContextControls.container);
  createFragmentApp(ContextControlsItem, {
    cmd: `XIT BURN ${getEntityNaturalIdFromAddress(site.address)}`,
  }).prependTo(contextBar);
}

function init() {
  tiles.observe('PROD', onTileReady);
}

features.add(import.meta.url, init, 'PROD: Adds a XIT BURN link to the context bar.');
