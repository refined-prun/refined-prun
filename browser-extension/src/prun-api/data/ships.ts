import { createEntitySlice } from '@src/prun-api/data/utils';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { State } from '@src/prun-api/data/store';

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

const selectors = shipsAdapter.getSelectors((s: State) => s.ships);
export const selectShips = selectors.selectAll;

export const selectShipByRegistration = (s: State, registration: string) =>
  selectShips(s).find(x => x.registration === registration);
