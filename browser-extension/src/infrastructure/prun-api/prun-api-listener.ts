import socketIOMiddleware from './socket-io-middleware';
import { dispatch } from '@src/infrastructure/prun-api/data/api-messages';
import { companyContextId } from '@src/infrastructure/prun-api/data/user-data';

export interface Packet {
  messageType?: string;
  payload?: {
    message: Packet;
  };
}

export function listenPrunApi() {
  socketIOMiddleware<Packet>(onOpen, (context, payload) => {
    if (context === companyContextId.value || !companyContextId.value || !context) {
      processEvent(payload);
    }
    return false;
  });
}

function onOpen() {
  const storeAction = {
    type: 'CLIENT_CONNECTION_OPENED',
    data: undefined,
  };
  dispatch(storeAction);
}

function processEvent(packet: Packet) {
  if (!packet || !packet.messageType || !packet.payload) {
    return;
  }

  if (__DEV__) {
    performance.mark(`${packet.messageType}-START`);
  }

  if (packet.messageType === 'ACTION_COMPLETED') {
    processEvent(packet.payload.message);
  } else {
    const storeAction = {
      type: packet.messageType,
      data: packet.payload,
    };
    dispatch(storeAction);
  }

  if (__DEV__) {
    performance.mark(`${packet.messageType}-END`);
    performance.measure(
      packet.messageType,
      `${packet.messageType}-START`,
      `${packet.messageType}-END`,
    );
  }
}
