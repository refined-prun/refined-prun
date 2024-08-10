import { caseReducers } from '@src/prun-api/data/utils';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

export const sitesAdapter = createEntityAdapter<PrunApi.Site, string>({
  selectId: x => x.siteId,
});

export const platformsAdapter = createEntityAdapter<PrunApi.Platform>();

const slice = createSlice({
  name: 'sites',
  initialState: {
    sites: sitesAdapter.getInitialState(),
    platforms: platformsAdapter.getInitialState(),
    fetched: false,
  },
  reducers: {},
  extraReducers: builder =>
    caseReducers(builder, {
      SITE_SITES(state, data: { sites: PrunApi.Site[] }) {
        sitesAdapter.setAll(state.sites, data.sites);
        platformsAdapter.setAll(
          state.platforms,
          data.sites.flatMap(x => x.platforms),
        );
        state.fetched = true;
      },
      SITE_SITE(state, data: PrunApi.Site) {
        sitesAdapter.setOne(state.sites, data);
        platformsAdapter.setAll(state.platforms, data.platforms);
      },
    }),
});

export const sitesReducer = slice.reducer;
