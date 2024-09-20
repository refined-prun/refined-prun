import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { request } from '@src/infrastructure/prun-api/data/request-hooks';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { messages } from '@src/infrastructure/prun-api/data/api-messages';

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
  singleBufferRequest(`BS ${naturalId}`)();
}

function singleBufferRequest(command: string) {
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
    showBuffer(command, { autoClose: true });
  };
}

request.production = requestBS;
request.workforce = requestBS;
request.cxos = singleBufferRequest('CXOS');
request.fxos = singleBufferRequest('FXOS');
request.blueprints = singleBufferRequest('BLU');
request.shipyards = singleBufferRequest('SHY');
request.shipyardProjects = singleBufferRequest('SHYP');
