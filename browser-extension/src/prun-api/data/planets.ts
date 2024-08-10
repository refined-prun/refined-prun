import { createEntitySlice } from '@src/prun-api/data/utils';
import { createEntityAdapter } from '@reduxjs/toolkit';

interface Planet {
  naturalId: string;
  name: string;
}

export const planetsAdapter = createEntityAdapter<Planet, string>({
  selectId: x => x.naturalId,
});

const slice = createEntitySlice(planetsAdapter, {
  FIO_PLANET_DATA(state, data: { planets: Planet[] }) {
    planetsAdapter.setAll(state, data.planets);
    state.fetched = true;
  },
});

export const planetsReducer = slice.reducer;
