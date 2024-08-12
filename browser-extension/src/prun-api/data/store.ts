import { setAutoFreeze } from 'immer';
import { configureStore } from '@reduxjs/toolkit';
import { addressesReducer } from '@src/prun-api/data/addresses';
import { contractsReducer } from '@src/prun-api/data/contracts';
import { cxobReducer } from '@src/prun-api/data/cxob';
import { cxosReducer } from '@src/prun-api/data/cxos';
import { flightsReducer } from '@src/prun-api/data/flights';
import { fxosReducer } from '@src/prun-api/data/fxos';
import { materialsReducer } from '@src/prun-api/data/materials';
import { planetsReducer } from '@src/prun-api/data/planets';
import { productionReducer } from '@src/prun-api/data/production';
import { shipsReducer } from '@src/prun-api/data/ships';
import { sitesReducer } from '@src/prun-api/data/sites';
import { starsReducer } from '@src/prun-api/data/stars';
import { storageReducer } from '@src/prun-api/data/storage';
import { warehousesReducer } from '@src/prun-api/data/warehouses';
import { workforcesReducer } from '@src/prun-api/data/workforces';

setAutoFreeze(false);

export const store = configureStore({
  reducer: {
    addresses: addressesReducer,
    contracts: contractsReducer,
    cxob: cxobReducer,
    cxos: cxosReducer,
    flights: flightsReducer,
    fxos: fxosReducer,
    materials: materialsReducer,
    planets: planetsReducer,
    production: productionReducer,
    ships: shipsReducer,
    sites: sitesReducer,
    stars: starsReducer,
    storage: storageReducer,
    warehouses: warehousesReducer,
    workforces: workforcesReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: false,
      immutableCheck: false,
      serializableCheck: false,
      actionCreatorCheck: false,
    }),
});

export type State = ReturnType<typeof store.getState>;
