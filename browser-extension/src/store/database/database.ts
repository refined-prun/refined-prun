import cxosAdapter from '@src/store/database/cxos';
import fxosAdapter from '@src/store/database/fxos';
import contractAdapter from '@src/store/database/contracts';
import shipsAdapter from '@src/store/database/ships';
import cxobAdapter from '@src/store/database/cxob';

let state = {
  contracts: contractAdapter.getInitialState(),
  cxob: cxobAdapter.getInitialState(),
  cxos: cxosAdapter.getInitialState(),
  fxos: fxosAdapter.getInitialState(),
  ships: shipsAdapter.getInitialState(),
};

export type State = typeof state;

type Listener = (state: State) => void;

const listeners: Set<Listener> = new Set<Listener>();

function update(packet: PrunApi.Packet) {
  state = {
    contracts: contractAdapter.reduce(state.contracts, packet),
    cxob: cxobAdapter.reduce(state.cxob, packet),
    cxos: cxosAdapter.reduce(state.cxos, packet),
    fxos: fxosAdapter.reduce(state.fxos, packet),
    ships: shipsAdapter.reduce(state.ships, packet),
  };
  for (const listener of listeners) {
    try {
      listener(state);
    } catch (e) {
      console.error(e);
    }
  }
}

const database = {
  getState: () => state,
  update,
  subscribe: (listener: Listener) => listeners.add(listener),
  unsubscribe: (listener: Listener) => listeners.delete(listener),
};

export default database;
