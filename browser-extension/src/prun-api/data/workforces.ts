import { createEntitySlice } from '@src/prun-api/data/utils';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { State } from '@src/prun-api/data/store';

interface Entity {
  address: PrunApi.Address;
  siteId: string;
  workforces: PrunApi.Workforce[];
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

const selectors = workforcesAdapter.getSelectors((s: State) => s.workforces);
export const selectWorkforceBySiteId = (state: State, address: string) =>
  selectors.selectById(state, address)?.workforces;
