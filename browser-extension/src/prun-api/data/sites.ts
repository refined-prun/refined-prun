import {
  getPlanetNameFromAddress,
  getPlanetNaturalIdFromAddress,
} from '@src/prun-api/data/addresses';
import { createEntityStore } from '@src/prun-api/data/create-entity-store';
import { messages } from '@src/prun-api/data/api-messages';
import { computed } from 'vue';

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

const byPlanetNaturalId = computed(() => {
  const map = new Map<string, PrunApi.Site>();
  for (const site of state.all.value) {
    const id = getPlanetNaturalIdFromAddress(site.address)!.toLowerCase();
    map.set(id, site);
  }
  return map;
});

const byPlanetName = computed(() => {
  const map = new Map<string, PrunApi.Site>();
  for (const site of state.all.value) {
    const id = getPlanetNameFromAddress(site.address)!.toLowerCase();
    map.set(id, site);
  }
  return map;
});

export const sitesStore = {
  ...state,
  getByPlanetNaturalIdOrName: (naturalIdOrName?: string | null) =>
    sitesStore.getByPlanetNaturalId(naturalIdOrName) ?? sitesStore.getByPlanetName(naturalIdOrName),
  getByPlanetNaturalId: (naturalId?: string | null) =>
    naturalId ? byPlanetNaturalId.value.get(naturalId) : undefined,
  getByPlanetName: (name?: string | null) => (name ? byPlanetName.value.get(name) : undefined),
};
