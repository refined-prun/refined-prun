import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

const store = createEntityStore<PrunApi.MaterialCategory>();
const state = store.state;

onApiMessage({
  WORLD_MATERIAL_CATEGORIES(data: { categories: PrunApi.MaterialCategory[] }) {
    store.setAll(data.categories);
    store.setFetched();
  },
});

export const toSerializableCategoryName = (name: string) =>
  name.replaceAll('(', '').replaceAll(')', '').toUpperCase();

const getBySerializableName = createMapGetter(state.all, x => x.name, toSerializableCategoryName);
const getById = createMapGetter(state.all, x => x.id);

export const getCategoryById = (
  id: string | undefined | null,
): PrunApi.MaterialCategory | undefined => {
  if (!id) return undefined;
  return getById(id);
};

export const getCategoryByMaterialIdentifier = (
  identifier: string | undefined | null,
): PrunApi.MaterialCategory | undefined => {
  if (!identifier) return undefined;

  const search = identifier.toUpperCase();

  const material = materialsStore.all.value?.find(
    m => m.ticker.toUpperCase() === search || m.name.toUpperCase() === search,
  );

  return getCategoryById(material?.category);
};

export const materialCategoriesStore = {
  ...state,
  getById,
  getBySerializableName,
  getCategoryById,
  getCategoryByMaterialIdentifier,
};
