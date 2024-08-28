import { sitesStore } from '@src/prun-api/data/sites';
import { getPlanetNaturalIdFromAddress } from '@src/prun-api/data/addresses';
import { showBuffer } from '@src/util';
import { request } from '@src/prun-api/data/request-hooks';

const bs: Set<string> = new Set();

function requestBS(siteId?: string | null) {
  const site = sitesStore.getById(siteId);
  if (!site) {
    return;
  }
  if (bs.has(site.siteId)) {
    return;
  }
  bs.add(site.siteId);
  const naturalId = getPlanetNaturalIdFromAddress(site.address);
  showBuffer(`BS ${naturalId}`, true, true);
}

function singleBufferRequest(command: string) {
  let requested = false;

  return function request() {
    if (requested) {
      return;
    }
    requested = true;
    showBuffer(command, true, true);
  };
}

request.production = requestBS;
request.workforce = requestBS;
request.cxos = singleBufferRequest('CXOS');
request.fxos = singleBufferRequest('FXOS');
request.blueprints = singleBufferRequest('BLU');
request.shipyards = singleBufferRequest('SHY');
request.shipyardProjects = singleBufferRequest('SHYP');
