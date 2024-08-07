import cxosAdapter from '@src/store/database/cxos';
import { State } from '@src/store/database/database';
import fxosAdapter from '@src/store/database/fxos';
import contractAdapter from '@src/store/database/contracts';

const contracts = contractAdapter.getSelectors((s: State) => s.contracts);
export const selectContracts = contracts.selectAll;
export const selectContractById = contracts.selectById;
export const selectContractsTotal = contracts.selectTotal;

const cxos = cxosAdapter.getSelectors((s: State) => s.cxos);
export const selectCxos = cxos.selectAll;
export const selectCxosTotal = cxos.selectTotal;

const fxos = fxosAdapter.getSelectors((s: State) => s.fxos);
export const selectFxos = fxos.selectAll;
export const selectFxosTotal = fxos.selectTotal;
