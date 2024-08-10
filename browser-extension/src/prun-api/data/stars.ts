import { createEntitySlice } from '@src/prun-api/data/utils';
import { createEntityAdapter } from '@reduxjs/toolkit';

export const starsAdapter = createEntityAdapter<PrunApi.Star, string>({
  selectId: x => x.systemId,
});

const slice = createEntitySlice(starsAdapter, {
  SYSTEM_STARS_DATA(state, data: { stars: PrunApi.Star[] }) {
    starsAdapter.setAll(state, data.stars);
    state.fetched = true;
  },
});

export const starsReducer = slice.reducer;
