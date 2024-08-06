import cxosAdapter from '@src/store/database/cxos';
import fxosAdapter from '@src/store/database/fxos';

let state = {
  cxos: cxosAdapter.getInitialState(),
  fxos: fxosAdapter.getInitialState(),
};

export type State = typeof state;

type Listener = (state: State) => void;

const listeners: Set<Listener> = new Set<Listener>();

function update(packet: PrunApi.Packet) {
  state = {
    cxos: cxosAdapter.reduce(state.cxos, packet),
    fxos: fxosAdapter.reduce(state.fxos, packet),
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
