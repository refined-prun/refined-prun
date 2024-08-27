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

let cxos = false;

function requestCXOS() {
  if (cxos) {
    return;
  }
  cxos = true;
  showBuffer(`CXOS`, true, true);
}

let fxos = false;

function requestFXOS() {
  if (fxos) {
    return;
  }
  fxos = true;
  showBuffer(`FXOS`, true, true);
}

let blu = false;

function requestBLU() {
  if (blu) {
    return;
  }
  blu = true;
  showBuffer(`BLU`, true, true);
}

request.production = requestBS;
request.workforce = requestBS;
request.cxos = requestCXOS;
request.fxos = requestFXOS;
request.blueprints = requestBLU;
