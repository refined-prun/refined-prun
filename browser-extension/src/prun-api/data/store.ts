import { setAutoFreeze } from 'immer';
import { configureStore } from '@reduxjs/toolkit';
import { contractsReducer } from '@src/prun-api/data/contracts';
import { cxobReducer } from '@src/prun-api/data/cxob';
import { cxosReducer } from '@src/prun-api/data/cxos';
import { fxosReducer } from '@src/prun-api/data/fxos';
import { shipsReducer } from '@src/prun-api/data/ships';

setAutoFreeze(false);

export const store = configureStore({
  reducer: {
    contracts: contractsReducer,
    cxob: cxobReducer,
    cxos: cxosReducer,
    fxos: fxosReducer,
    ships: shipsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export type State = ReturnType<typeof store.getState>;
