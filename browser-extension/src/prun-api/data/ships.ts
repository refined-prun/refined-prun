import { createEntitySlice } from '@src/prun-api/data/utils';
import { createEntityAdapter } from '@reduxjs/toolkit';

export const shipsAdapter = createEntityAdapter<PrunApi.Ship>();

const slice = createEntitySlice(shipsAdapter, {
  SHIP_SHIPS(state, data: { ships: PrunApi.Ship[] }) {
    shipsAdapter.setAll(state, data.ships);
    state.fetched = true;
  },
  SHIP_DATA(state, data: PrunApi.Ship) {
    shipsAdapter.setOne(state, data);
  },
});

export const shipsReducer = slice.reducer;
