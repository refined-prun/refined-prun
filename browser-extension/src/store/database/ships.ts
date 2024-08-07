import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';

const adapter = createEntityAdapter<PrunApi.SHIP_SHIPS.Ship>();

function reduce(state: EntityState<PrunApi.SHIP_SHIPS.Ship, string>, packet: PrunApi.Packet) {
  switch (packet.messageType) {
    case 'SHIP_SHIPS': {
      return adapter.setAll(state, packet.payload.ships);
    }
  }

  return state;
}

const shipsAdapter = {
  ...adapter,
  reduce,
};

export default shipsAdapter;
