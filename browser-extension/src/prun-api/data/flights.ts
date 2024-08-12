import { createEntitySlice } from '@src/prun-api/data/utils';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { State } from '@src/prun-api/data/store';

export const flightsAdapter = createEntityAdapter<PrunApi.Flight>();

const slice = createEntitySlice(flightsAdapter, {
  SHIP_FLIGHT_FLIGHTS(state, data: { flights: PrunApi.Flight[] }) {
    flightsAdapter.setAll(state, data.flights);
    state.fetched = true;
  },
  SHIP_FLIGHT_FLIGHT(state, data: PrunApi.Flight) {
    flightsAdapter.setOne(state, data);
  },
  SHIP_FLIGHT_FLIGHT_ENDED(state, data: PrunApi.Flight) {
    flightsAdapter.removeOne(state, data.id);
  },
});

export const flightsReducer = slice.reducer;

const selectors = flightsAdapter.getSelectors((s: State) => s.flights);

export const selectFlightById = selectors.selectById;
