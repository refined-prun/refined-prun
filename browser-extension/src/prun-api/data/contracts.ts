import { createEntitySlice } from '@src/prun-api/data/utils';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { State } from '@src/prun-api/data/store';

export const contractsAdapter = createEntityAdapter<PrunApi.Contract>();

const slice = createEntitySlice(contractsAdapter, {
  CONTRACTS_CONTRACTS(state, data: { contracts: PrunApi.Contract[] }) {
    contractsAdapter.setAll(state, data.contracts);
    state.fetched = true;
  },
  CONTRACTS_CONTRACT(state, data: PrunApi.Contract) {
    contractsAdapter.setOne(state, data);
  },
});

export const contractsReducer = slice.reducer;

const selectors = contractsAdapter.getSelectors((s: State) => s.contracts);
export const selectContracts = selectors.selectAll;
export const selectContractById = selectors.selectById;
export const selectContractsTotal = selectors.selectTotal;

export const selectContractsFetched = (s: State) => s.contracts.fetched;
