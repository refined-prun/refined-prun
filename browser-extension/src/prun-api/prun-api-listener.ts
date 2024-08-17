import socketIOMiddleware from './socket-io-middleware';
import { dispatch } from '@src/prun-api/data/api-messages';

let companyContext: string | undefined;

export async function listenPrunApi() {
  socketIOMiddleware<PrunApi.Packet>((context, payload) => {
    try {
      if (context === companyContext || !companyContext || !context) {
        processEvent(payload);
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  });
}

function processEvent(packet: PrunApi.Packet) {
  if (__DEV__) {
    performance.mark(`${packet.messageType}-START`);
  }

  if (__DEV__ && packet.messageType !== 'ACTION_COMPLETED') {
    console.log(packet);
  }

  if (packet.messageType === 'ACTION_COMPLETED') {
    const message = packet.payload?.message;
    if (message) {
      const storeAction = {
        type: message.messageType,
        data: message.payload,
      };
      dispatch(storeAction);
      message['dispatched'] = true;
    }
  } else if (!packet['dispatched']) {
    const storeAction = {
      type: packet.messageType,
      data: packet.payload,
    };
    dispatch(storeAction);
  }

  switch (packet.messageType) {
    case 'ACTION_COMPLETED': {
      const message = packet.payload.message;
      if (message) {
        processEvent(message);
      }
      break;
    }
    case 'USER_DATA': {
      const context = packet.payload.contexts.find(x => x.type === 'COMPANY');
      companyContext = context?.id ?? companyContext;
      break;
    }
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
