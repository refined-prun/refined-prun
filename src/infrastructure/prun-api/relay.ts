import { onAnyApiMessage } from '@src/infrastructure/prun-api/data/api-messages';

const storageKey = 'rprun-relay';
export const relayUrl = ref(localStorage.getItem(storageKey) ?? '');
let websocket = undefined as WebSocket | undefined;
const pending = [] as string[];

function updateUrl(url: string) {
  if (!url) {
    localStorage.removeItem(storageKey);
  } else {
    localStorage.setItem(storageKey, url);
  }
  websocket?.close();
  pending.length = 0;
  websocket = undefined;
  if (!url) {
    return;
  }
  websocket = new WebSocket(url);
  websocket.addEventListener('open', () => {
    for (const chunk of pending) {
      websocket?.send(chunk);
    }
    pending.length = 0;
  });
  websocket.addEventListener('close', () => {
    relayUrl.value = '';
  });
  websocket.addEventListener('error', () => {
    relayUrl.value = '';
  });
}

export function startRelay() {
  watch(relayUrl, updateUrl, { immediate: true });
  onAnyApiMessage(message => {
    if (!websocket) {
      return;
    }
    const data = JSON.stringify(message) + '\n';
    const maxChunkSize = 65536;
    for (let i = 0; i < data.length; i += maxChunkSize) {
      const chunk = data.slice(i, i + maxChunkSize);
      if (websocket.readyState === 0) {
        pending.push(chunk);
      } else if (websocket.readyState === 1) {
        websocket.send(chunk);
      }
    }
  });
}
