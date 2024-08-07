import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';

type Entity = PrunApi.COMEX_BROKER_DATA.Payload & { timestamp: number };

const adapter = createEntityAdapter<Entity, string>({
  selectId: (x: Entity) => x.ticker,
});

function reduce(state: EntityState<Entity, string>, packet: PrunApi.Packet) {
  switch (packet.messageType) {
    case 'COMEX_BROKER_DATA': {
      return adapter.setOne(state, {
        ...packet.payload,
        timestamp: Date.now(),
      });
    }
  }

  return state;
}

const cxobAdapter = {
  ...adapter,
  reduce,
};

export default cxobAdapter;
