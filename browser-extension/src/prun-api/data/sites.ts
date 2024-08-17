import {
  getPlanetNameFromAddress,
  getPlanetNaturalIdFromAddress,
} from '@src/prun-api/data/addresses';
import { createEntityStore } from '@src/prun-api/data/create-entity-store';
import { messages } from '@src/prun-api/data/api-messages';
import { createMapGetter } from '@src/prun-api/data/create-map-getter';

const store = createEntityStore<PrunApi.Site>(x => x.siteId);
const state = store.state;

messages({
  SITE_SITES(data: { sites: PrunApi.Site[] }) {
    console.log('SITE_SITES', data);
    store.setAll(data.sites);
    store.setFetched();
  },
  SITE_SITE(data: PrunApi.Site) {
    store.setOne(data);
  },
});

const getByPlanetNaturalId = createMapGetter(
  state.all,
  x => getPlanetNaturalIdFromAddress(x.address)!.toLowerCase(),
  x => x.toLowerCase(),
);

const getByPlanetName = createMapGetter(
  state.all,
  x => getPlanetNameFromAddress(x.address)!.toLowerCase(),
  x => x.toLowerCase(),
);

const getByPlanetNaturalIdOrName = (value?: string | null) =>
  getByPlanetNaturalId(value) ?? getByPlanetName(value);

export const getBuildingLastRepair = (building: PrunApi.Platform) =>
  building.lastRepair?.timestamp ?? building.creationTime.timestamp;

export const sitesStore = {
  ...state,
  getByPlanetNaturalId,
  getByPlanetName,
  getByPlanetNaturalIdOrName,
};
