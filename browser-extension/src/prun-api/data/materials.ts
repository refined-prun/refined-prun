import { caseReducers } from '@src/prun-api/data/utils';
import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { State } from '@src/prun-api/data/store';

export const materialsAdapter = createEntityAdapter<PrunApi.Material>();
export const materialCategoriesAdapter = createEntityAdapter<PrunApi.MaterialCategory>();

const slice = createSlice({
  name: 'materials',
  initialState: {
    categories: materialCategoriesAdapter.getInitialState(),
    materials: materialsAdapter.getInitialState(),
    fetched: false,
  },
  reducers: {},
  extraReducers: builder =>
    caseReducers(builder, {
      WORLD_MATERIAL_CATEGORIES(state, data: { categories: PrunApi.MaterialCategory[] }) {
        materialCategoriesAdapter.setAll(state.categories, data.categories);
        const materials = data.categories.flatMap(x => x.materials);
        materialsAdapter.setAll(state.materials, materials);
        state.fetched = true;
      },
    }),
});

export const materialsReducer = slice.reducer;

const materialCategorySelectors = materialCategoriesAdapter.getSelectors(
  (s: State) => s.materials.categories,
);
const materialSelectors = materialsAdapter.getSelectors((s: State) => s.materials.materials);
export const selectCategoryById = materialCategorySelectors.selectById;
const selectMaterialTickerMap = createSelector(materialSelectors.selectAll, materials => {
  const map: Map<string, PrunApi.Material> = new Map();
  for (const material of materials) {
    map.set(material.ticker.toUpperCase(), material);
  }
  return map;
});
export const selectMaterialByTicker = (state: State, ticker: string) =>
  selectMaterialTickerMap(state).get(ticker.toUpperCase());
export const selectMaterialsByTickers = (state: State, tickers: string[]) =>
  tickers.map(x => selectMaterialByTicker(state, x));

export const sortMaterials = (state: State, materials: PrunApi.Material[]) => {
  const categories = materialCategorySelectors.selectEntities(state);
  return materials.slice().sort((a, b) => {
    const categoryA = categories[a.category].name;
    const categoryB = categories[b.category].name;
    return categoryA === categoryB
      ? a.ticker.localeCompare(b.ticker)
      : categoryA.localeCompare(categoryB);
  });
};
