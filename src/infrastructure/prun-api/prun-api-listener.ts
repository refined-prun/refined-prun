import socketIOMiddleware, { Middleware } from './socket-io-middleware';
import { dispatch } from '@src/infrastructure/prun-api/data/api-messages';
import { companyContextId } from '@src/infrastructure/prun-api/data/user-data';
import { startMeasure, stopMeasure } from '@src/utils/performance-measure';
import { context } from '@src/infrastructure/prun-api/data/screens';
import { watchUntil } from '@src/utils/watch';

interface Message {
  messageType?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: { message: Message } | any;
}

export const initialApiLoadingComplete = ref(false);

const middleware: Middleware<Message> = {
  onOpen: function () {
    const storeAction = {
      type: 'CLIENT_CONNECTION_OPENED',
      data: undefined,
    };
    dispatch(storeAction);
  },
  onMessage: async message => {
    if (context.value === companyContextId.value || !companyContextId.value || !context.value) {
      return (await processEvent(message)) ?? false;
    }
    return false;
  },
  dispatchClientMessage: ref(undefined),
};

export function listenPrunApi() {
  socketIOMiddleware<Message>(middleware);
}

export const isRecordingPrunLog = ref(false);
export const prunLog = ref([] as Message[]);

async function processEvent(message: Message | undefined) {
  if (!message || !message.messageType || !message.payload) {
    return;
  }

  startMeasure(message.messageType);

  try {
    if (message.messageType === 'ACTION_COMPLETED') {
      return processEvent(message.payload.message);
    } else {
      if (isRecordingPrunLog.value) {
        prunLog.value.push(message);
      }
      const storeAction = {
        type: message.messageType,
        data: message.payload,
      };
      const result = dispatch(storeAction);
      // Block the COMPANY_DATA message until the initial loading is complete
      // so refined prun could load before the base game.
      if (message.messageType === 'COMPANY_DATA' && !initialApiLoadingComplete.value) {
        await watchUntil(() => initialApiLoadingComplete.value);
      }
      return result;
    }
  } finally {
    stopMeasure();
  }
}

export const canDispatchClientPrunMessage = computed(
  () => !!middleware.dispatchClientMessage.value,
);

export function dispatchClientPrunMessage(message: Message) {
  if (!middleware.dispatchClientMessage.value) {
    return false;
  }
  middleware.dispatchClientMessage.value(message);
  return true;
}
