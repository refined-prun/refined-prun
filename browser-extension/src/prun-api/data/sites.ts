import { caseReducers } from '@src/prun-api/data/utils';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { State } from '@src/prun-api/data/store';
import {
  getPlanetNameFromAddress,
  getPlanetNaturalIdFromAddress,
} from '@src/prun-api/data/addresses';

export const sitesAdapter = createEntityAdapter<PrunApi.Site, string>({
  selectId: x => x.siteId,
});

export const platformsAdapter = createEntityAdapter<PrunApi.Platform>();

const slice = createSlice({
  name: 'sites',
  initialState: {
    sites: sitesAdapter.getInitialState(),
    byPlanetNaturalId: {} as Record<string, PrunApi.Site | undefined>,
    byPlanetName: {} as Record<string, PrunApi.Site | undefined>,
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
        for (const site of data.sites) {
          setSiteByAddress(state, site);
        }
        state.fetched = true;
      },
      SITE_SITE(state, data: PrunApi.Site) {
        sitesAdapter.setOne(state.sites, data);
        platformsAdapter.setMany(state.platforms, data.platforms);
        setSiteByAddress(state, data);
      },
    }),
});

function setSiteByAddress(state: ReturnType<typeof slice.getInitialState>, site: PrunApi.Site) {
  state.byPlanetNaturalId[getPlanetNaturalIdFromAddress(site.address)!.toLowerCase()] = site;
  state.byPlanetName[getPlanetNameFromAddress(site.address)!.toLowerCase()] = site;
}

export const sitesReducer = slice.reducer;

const selectors = sitesAdapter.getSelectors((s: State) => s.sites.sites);
export const selectSiteById = selectors.selectById;
export const selectSitesEntities = selectors.selectEntities;

export const selectSiteByPlanetNaturalIdOrName = (state: State, naturalIdOrName: string) =>
  selectSiteByPlanetNaturalId(state, naturalIdOrName) ??
  selectSiteByPlanetName(state, naturalIdOrName);
export const selectSiteByPlanetNaturalId = (state: State, naturalId: string) =>
  state.sites.byPlanetNaturalId[naturalId.toLowerCase()];
export const selectSiteByPlanetName = (state: State, naturalId: string) =>
  state.sites.byPlanetName[naturalId.toLowerCase()];
