import socketIOMiddleware, { Middleware } from './socket-io-middleware';
import { dispatch } from '@src/infrastructure/prun-api/data/api-messages';
import { companyContextId } from '@src/infrastructure/prun-api/data/user-data';
import { startMeasure, stopMeasure } from '@src/utils/performance-measure';
import { context } from '@src/infrastructure/prun-api/data/screens';

interface Message {
  messageType?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: { message: Message } | any;
}

const middleware: Middleware<Message> = {
  onOpen: function () {
    const storeAction = {
      type: 'CLIENT_CONNECTION_OPENED',
      data: undefined,
    };
    dispatch(storeAction);
  },
  onMessage: message => {
    if (context.value === companyContextId.value || !companyContextId.value || !context.value) {
      processEvent(message);
    }
    return false;
  },
  dispatchClientMessage: undefined,
};

export function listenPrunApi() {
  socketIOMiddleware<Message>(middleware);
}

function processEvent(message: Message) {
  if (!message || !message.messageType || !message.payload) {
    return;
  }

  startMeasure(message.messageType);

  if (message.messageType === 'ACTION_COMPLETED') {
    processEvent(message.payload.message);
  } else {
    const storeAction = {
      type: message.messageType,
      data: message.payload,
    };
    dispatch(storeAction);
  }

  stopMeasure();
}

export function dispatchClientPrunMessage(message: Message) {
  if (!middleware.dispatchClientMessage) {
    return false;
  }
  middleware.dispatchClientMessage?.(message);
  return true;
}
