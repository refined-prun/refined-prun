import socketIOMiddleware from './socket-io-middleware';
import { dispatch } from '@src/infrastructure/prun-api/data/api-messages';
import { companyContextId } from '@src/infrastructure/prun-api/data/user-data';

export interface Packet {
  messageType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

export async function listenPrunApi() {
  socketIOMiddleware<Packet>((context, payload) => {
    try {
      if (context === companyContextId.value || !companyContextId.value || !context) {
        processEvent(payload);
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  });
}

function processEvent(packet: Packet) {
  if (!packet || !packet.messageType || !packet.payload) {
    return;
  }

  if (__DEV__) {
    performance.mark(`${packet.messageType}-START`);
  }

  if (packet.messageType === 'ACTION_COMPLETED') {
    processEvent(packet.payload?.message);
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
