import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';

const adapter = createEntityAdapter<PrunApi.Contract>();

function reduce(state: EntityState<PrunApi.Contract, string>, packet: PrunApi.Packet) {
  switch (packet.messageType) {
    case 'CONTRACTS_CONTRACTS': {
      return adapter.setAll(state, packet.payload.contracts);
    }
    case 'CONTRACTS_CONTRACT': {
      return adapter.setOne(state, packet.payload);
    }
  }

  return state;
}

const contractAdapter = {
  ...adapter,
  reduce,
};

export default contractAdapter;
