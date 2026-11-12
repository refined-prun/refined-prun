import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { castArray } from '@src/utils/cast-array';

const store = createEntityStore<PrunApi.LocalAd>();
const state = store.state;
// An LMA loads one ad; only a full ad list tells which ads of a market are gone.
const fullyLoadedMarkets = reactive(new Set<string>());

onApiMessage({
  DATA_DATA(data: { body: Arrayable<PrunApi.LocalAd>; path: string[] }) {
    if (data.path[0] !== 'localmarkets' || data.path[2] !== 'ads') {
      return;
    }
    store.setMany(castArray(data.body));
    store.setFetched();
    if (data.path.length === 3) {
      fullyLoadedMarkets.add(data.path[1]);
    }
  },
  DATA_DATA_REMOVED(data: { path: string[] }) {
    const id = data.path[3];
    if (data.path[0] !== 'localmarkets' || data.path[2] !== 'ads' || id === undefined) {
      return;
    }
    store.removeOne(id);
  },
});

export const localAdsStore = {
  ...state,
  isMarketFullyLoaded: (localMarketId: string) => fullyLoadedMarkets.has(localMarketId),
};
