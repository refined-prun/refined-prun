import { setAutoFreeze } from 'immer';
import { configureStore } from '@reduxjs/toolkit';
import { addressesReducer } from '@src/prun-api/data/addresses';
import { contractsReducer } from '@src/prun-api/data/contracts';
import { cxobReducer } from '@src/prun-api/data/cxob';
import { cxosReducer } from '@src/prun-api/data/cxos';
import { fxosReducer } from '@src/prun-api/data/fxos';
import { materialsReducer } from '@src/prun-api/data/materials';
import { planetsReducer } from '@src/prun-api/data/planets';
import { productionReducer } from '@src/prun-api/data/production';
import { shipsReducer } from '@src/prun-api/data/ships';
import { sitesReducer } from '@src/prun-api/data/sites';
import { starsReducer } from '@src/prun-api/data/stars';
import { storesReducer } from '@src/prun-api/data/stores';
import { warehousesReducer } from '@src/prun-api/data/warehouses';
import { workforcesReducer } from '@src/prun-api/data/workforces';

setAutoFreeze(false);

export const store = configureStore({
  reducer: {
    addresses: addressesReducer,
    contracts: contractsReducer,
    cxob: cxobReducer,
    cxos: cxosReducer,
    fxos: fxosReducer,
    materials: materialsReducer,
    planets: planetsReducer,
    production: productionReducer,
    ships: shipsReducer,
    sites: sitesReducer,
    stars: starsReducer,
    stores: storesReducer,
    warehouses: warehousesReducer,
    workforces: workforcesReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export type State = ReturnType<typeof store.getState>;
