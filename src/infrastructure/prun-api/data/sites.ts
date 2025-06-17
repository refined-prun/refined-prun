import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';

const store = createEntityStore<PrunApi.Site>(x => x.siteId);
const state = store.state;

onApiMessage({
  SITE_SITES(data: { sites: PrunApi.Site[] }) {
    store.setAll(data.sites);
    store.setFetched();
  },
  SITE_SITE(data: PrunApi.Site) {
    store.setOne(data);
  },
  SITE_PLATFORM_BUILT(data: PrunApi.Platform) {
    const site = state.getById(data.siteId);
    if (site !== undefined && !site.platforms.some(x => x.id === data.id)) {
      store.setOne({
        ...site,
        platforms: [...site.platforms, data],
      });
    }
  },
  SITE_PLATFORM_UPDATED(data: PrunApi.Platform) {
    const site = state.getById(data.siteId);
    if (site !== undefined) {
      store.setOne({
        ...site,
        platforms: site.platforms.map(x => (x.id === data.id ? { ...x, ...data } : x)),
      });
    }
  },
  SITE_PLATFORM_REMOVED(data: { siteId: string; platformId: string }) {
    const site = state.getById(data.siteId);
    if (site !== undefined) {
      store.setOne({
        ...site,
        platforms: site.platforms.filter(x => x.id !== data.platformId),
      });
    }
  },
});

const getByShortId = createMapGetter(state.all, x => x.siteId.substring(0, 8));

const getById = (value?: string | null) => state.getById(value) ?? getByShortId(value);

const getByPlanetNaturalId = createMapGetter(
  state.all,
  x => getEntityNaturalIdFromAddress(x.address)!,
);

const getByPlanetName = createMapGetter(state.all, x => getEntityNameFromAddress(x.address)!);

const getByPlanetNaturalIdOrName = (value?: string | null) =>
  getByPlanetNaturalId(value) ?? getByPlanetName(value);

export const getBuildingLastRepair = (building: PrunApi.Platform) =>
  building.lastRepair?.timestamp ?? building.creationTime.timestamp;

export const sitesStore = {
  ...state,
  getById,
  getByPlanetNaturalId,
  getByPlanetName,
  getByPlanetNaturalIdOrName,
};
