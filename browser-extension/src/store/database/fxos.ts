import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';

const adapter = createEntityAdapter<PrunApi.FXOrder>();

function reduce(state: EntityState<PrunApi.FXOrder, string>, packet: PrunApi.Packet) {
  switch (packet.messageType) {
    case 'FOREX_TRADER_ORDERS': {
      return adapter.setAll(state, packet.payload.orders);
    }
    case 'FOREX_TRADER_ORDER_ADDED': {
      return adapter.addOne(state, packet.payload);
    }
    case 'FOREX_TRADER_ORDER_UPDATED': {
      return adapter.setOne(state, packet.payload);
    }
    case 'FOREX_TRADER_ORDER_REMOVED': {
      return adapter.removeOne(state, packet.payload.orderId);
    }
  }

  return state;
}

const fxosAdapter = {
  ...adapter,
  reduce,
};

export default fxosAdapter;
