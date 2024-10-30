import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';

const store = createEntityStore<PrunApi.MaterialCategory>();
const state = store.state;

messages({
  WORLD_MATERIAL_CATEGORIES(data: { categories: PrunApi.MaterialCategory[] }) {
    store.setAll(data.categories);
    store.setFetched();
  },
});

export const toSerializableCategoryName = (name: string) =>
  name.replaceAll('(', '').replaceAll(')', '').toUpperCase();

const getBySerializableName = createMapGetter(state.all, x => x.name, toSerializableCategoryName);

export const materialCategoriesStore = {
  ...state,
  getBySerializableName,
};
