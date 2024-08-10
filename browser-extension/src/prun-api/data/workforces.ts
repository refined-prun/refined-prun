import { createEntitySlice } from '@src/prun-api/data/utils';
import { createEntityAdapter } from '@reduxjs/toolkit';

interface Entity {
  address: PrunApi.Address;
  siteId: string;
  workforces: PrunApi.ProductionWorkforce[];
}

export const workforcesAdapter = createEntityAdapter<Entity, string>({
  selectId: x => x.siteId,
});

const slice = createEntitySlice(workforcesAdapter, {
  WORKFORCE_WORKFORCES(state, data: Entity) {
    workforcesAdapter.setOne(state, data);
  },
  WORKFORCE_WORKFORCES_UPDATED(state, data: Entity) {
    workforcesAdapter.setOne(state, data);
  },
});

export const workforcesReducer = slice.reducer;
