import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { implementRequestHooks } from '@src/infrastructure/prun-api/data/request-hooks';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { computed } from 'vue';
import { cxosStore } from '@src/infrastructure/prun-api/data/cxos';
import { fxosStore } from '@src/infrastructure/prun-api/data/fxos';
import { blueprintsStore } from '@src/infrastructure/prun-api/data/blueprints';
import { shipyardsStore } from '@src/infrastructure/prun-api/data/shipyards';
import { shipyardProjectsStore } from '@src/infrastructure/prun-api/data/shipyard-projects';

const bs: Set<string> = new Set();

messages({
  CLIENT_CONNECTION_OPENED() {
    bs.clear();
  },
});

function requestBS(siteId?: string | null) {
  const site = sitesStore.getById(siteId);
  if (!site) {
    return;
  }
  if (bs.has(site.siteId)) {
    return;
  }
  bs.add(site.siteId);
  const naturalId = getEntityNaturalIdFromAddress(site.address);
  singleBufferRequest(`BS ${naturalId}`, () => sitesStore.getById(siteId) !== undefined)();
}

function singleBufferRequest(command: string, closeWhen: () => boolean) {
  let requested = false;

  messages({
    CLIENT_CONNECTION_OPENED() {
      requested = false;
    },
  });

  return function request() {
    if (requested) {
      return;
    }
    requested = true;
    showBuffer(command, { autoClose: true, closeWhen: computed(closeWhen) });
  };
}

implementRequestHooks({
  production: requestBS,
  workforce: requestBS,
  cxos: singleBufferRequest('CXOS', () => cxosStore.fetched.value),
  fxos: singleBufferRequest('FXOS', () => fxosStore.fetched.value),
  blueprints: singleBufferRequest('BLU', () => blueprintsStore.fetched.value),
  shipyards: singleBufferRequest('SHY', () => shipyardsStore.fetched.value),
  shipyardProjects: singleBufferRequest('SHYP', () => shipyardProjectsStore.fetched.value),
});
