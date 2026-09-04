import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';

interface Planet {
  naturalId: string;
  name: string;
  cogcProgramType?: string | null;
}

const store = createEntityStore<Planet>({
  selectId: x => x.naturalId.toLowerCase(),
  preserveOnConnectionOpen: true,
});
const state = store.state;

onApiMessage({
  FIO_PLANET_DATA(data: { planets: Planet[] }) {
    store.setAll(data.planets);
    store.setFetched();
  },
  DATA_DATA(data: {
    body: { naturalId: string; cogcProgramType?: string | null };
    path: string[];
  }) {
    if (data.path[0] !== 'planets' || data.path.length !== 2) {
      return;
    }
    const existing = state.getById(data.body.naturalId);
    if (existing) {
      store.updateOne({ ...existing, cogcProgramType: data.body.cogcProgramType });
    }
  },
});

const getByNaturalId = createMapGetter(state.all, x => x.naturalId);

const getByName = createMapGetter(state.all, x => x.name);

const find = (naturalIdOrName?: string | null) =>
  getByNaturalId(naturalIdOrName) ?? getByName(naturalIdOrName);

export const planetsStore = {
  ...state,
  getByNaturalId,
  getByName,
  find,
};
