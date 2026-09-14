import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';

// A private GROUP channel with no other members stores packages across devices.
export const channelIdentifier = 'refined-agent';
export const channelCommand = `COMG ${channelIdentifier}`;

// Use the observed CHANNEL_DATA limit; no per-message query is available.
// Callers must check message length before posting.
export const maxMessageLength = 1000;

const store = createEntityStore<PrunApi.ChannelMessage>({ selectId: x => x.messageId });
const state = store.state;

const channelId = ref<string>();
const received = ref(false);
const inaccessible = ref(false);

function applyMembership(data: PrunApi.ChannelClientMembership) {
  if (data.identifier !== channelIdentifier) {
    return;
  }
  if (!data.joined || data.channelId === null) {
    channelId.value = undefined;
    inaccessible.value = true;
    received.value = true;
    return;
  }

  channelId.value = data.channelId;
  inaccessible.value = false;
}

onApiMessage({
  CLIENT_CONNECTION_OPENED() {
    channelId.value = undefined;
    inaccessible.value = false;
  },
  CHANNEL_MESSAGE_LIST(data: PrunApi.ChannelMessageList) {
    if (channelId.value === data.channelId) {
      inaccessible.value = false;
      store.setMany(data.messages);
      store.setFetched();
      received.value = true;
    }
  },
  CHANNEL_MESSAGE_ADDED(data: PrunApi.ChannelMessage) {
    if (channelId.value === data.channelId) {
      store.setOne(data);
    }
  },
  CHANNEL_CHANNEL_LIST(data: PrunApi.ChannelChannelList) {
    const membership = data.channels.find(x => x.identifier === channelIdentifier);
    if (membership) {
      applyMembership(membership);
    }
  },
  CHANNEL_CLIENT_MEMBERSHIP: applyMembership,
});

export const agentChannelStore = {
  ...state,
  channelId,
  received,
  inaccessible,
};
