import cxosAdapter from '@src/store/database/cxos';
import { State } from '@src/store/database/database';
import fxosAdapter from '@src/store/database/fxos';

const cxos = cxosAdapter.getSelectors((state: State) => state.cxos);
export const selectCxos = cxos.selectAll;
export const selectCxosTotal = cxos.selectTotal;

const fxos = fxosAdapter.getSelectors((state: State) => state.fxos);
export const selectFxos = fxos.selectAll;
export const selectFxosTotal = fxos.selectTotal;
