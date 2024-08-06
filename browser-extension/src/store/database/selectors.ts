import cxosAdapter from '@src/store/database/cxos';
import { State } from '@src/store/database/database';

const cxos = cxosAdapter.getSelectors((state: State) => state.cxos);
export const selectCxos = cxos.selectAll;
export const selectCxosTotal = cxos.selectTotal;
