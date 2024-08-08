import { State } from '@src/prun-api/data/store';
import { contractsAdapter } from '@src/prun-api/data/contracts';
import { cxobAdapter } from '@src/prun-api/data/cxob';
import { cxosAdapter } from '@src/prun-api/data/cxos';
import { fxosAdapter } from '@src/prun-api/data/fxos';
import { shipsAdapter } from '@src/prun-api/data/ships';

export const selectContractsFetched = (s: State) => s.contracts.fetched;
const contracts = contractsAdapter.getSelectors((s: State) => s.contracts);
export const selectContracts = contracts.selectAll;
export const selectContractById = contracts.selectById;
export const selectContractsTotal = contracts.selectTotal;

const cxob = cxobAdapter.getSelectors((s: State) => s.cxob);
export const selectCxobByTicker = cxob.selectById;

const cxos = cxosAdapter.getSelectors((s: State) => s.cxos);
export const selectCxos = cxos.selectAll;
export const selectCxosTotal = cxos.selectTotal;

const fxos = fxosAdapter.getSelectors((s: State) => s.fxos);
export const selectFxos = fxos.selectAll;
export const selectFxosTotal = fxos.selectTotal;

const ships = shipsAdapter.getSelectors((s: State) => s.ships);
export const selectShips = ships.selectAll;
