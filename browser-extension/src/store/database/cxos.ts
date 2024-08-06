import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';

const adapter = createEntityAdapter<PrunApi.CXOrder>();

function reduce(state: EntityState<PrunApi.CXOrder, string>, packet: PrunApi.Packet) {
  switch (packet.messageType) {
    case 'COMEX_TRADER_ORDERS': {
      return adapter.setAll(state, packet.payload.orders);
    }
    case 'COMEX_TRADER_ORDER_ADDED': {
      return adapter.addOne(state, packet.payload);
    }
    case 'COMEX_TRADER_ORDER_UPDATED': {
      return adapter.setOne(state, packet.payload);
    }
    case 'COMEX_TRADER_ORDER_REMOVED': {
      return adapter.removeOne(state, packet.payload.orderId);
    }
  }

  return state;
}

const cxosAdapter = {
  ...adapter,
  reduce,
};

export default cxosAdapter;
