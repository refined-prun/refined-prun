import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';

const store = createEntityStore<PrunApi.Material>();
const state = store.state;

onApiMessage({
  WORLD_MATERIAL_CATEGORIES(data: { categories: PrunApi.MaterialCategory[] }) {
    const materials = data.categories.flatMap(x => x.materials);
    store.setAll(materials);
    store.setFetched();
  },
});

const getByName = createMapGetter(state.all, x => x.name);

const getByTicker = (() => {
  const getter = createMapGetter(state.all, x => x.ticker);

  return (value?: string | null) => {
    if (!value) {
      return undefined;
    }

    // Extract ticker from MAT.CX
    const dotIndex = value.indexOf('.');
    if (dotIndex >= 0) {
      return getter(value.substring(0, dotIndex));
    }
    return getter(value);
  };
})();

export const materialsStore = {
  ...state,
  getByTicker,
  getByName,
};
