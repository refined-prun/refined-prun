import { createEntitySlice } from '@src/prun-api/data/utils';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { State } from '@src/prun-api/data/store';

type Entity = PrunApi.CXBroker & { timestamp: number };

export const cxobAdapter = createEntityAdapter<Entity, string>({
  selectId: (x: Entity) => x.ticker,
});

const slice = createEntitySlice(cxobAdapter, {
  COMEX_BROKER_DATA(state, data: PrunApi.CXBroker) {
    cxobAdapter.setOne(state, {
      ...data,
      timestamp: Date.now(),
    });
  },
});

export const cxobReducer = slice.reducer;

const selectors = cxobAdapter.getSelectors((s: State) => s.cxob);
export const selectCxobByTicker = selectors.selectById;
