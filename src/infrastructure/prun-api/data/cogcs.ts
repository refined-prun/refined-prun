import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';

const store = createEntityStore<PrunApi.Cogc>({ selectId: x => x.planet.id });
const state = store.state;

onApiMessage({
  DATA_DATA(data: { body: PrunApi.Cogc; path: string[] }) {
    if (data.path.length !== 4 || data.path[0] !== 'planets' || data.path[2] !== 'cogc') {
      return;
    }
    store.setOne(data.body);
    store.setFetched();
  },
});

const getByPlanetNaturalId = createMapGetter(state.all, x => x.planet.naturalId);

export const cogcsStore = {
  ...state,
  getByPlanetNaturalId,
};
