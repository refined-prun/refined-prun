import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { focusElement, changeInputValue } from '@src/util';
import { sleep } from '@src/utils/sleep';
import { watchUntil } from '@src/utils/watch';
import { waitNodeDisconnected } from '@src/utils/on-node-disconnected';
import { waitUntil } from '@src/utils/wait';
import {
  channelCommand,
  agentChannelStore,
  channelIdentifier,
} from '@src/infrastructure/prun-api/data/agent-channel';

const setupErrorMessage = `The "${channelIdentifier}" channel isn't set up - open COM, click "new group", add no other members, and name it "${channelIdentifier}".`;
const historyTimeout = 5000;

// Fetch initial history once per connection. The channel store merges later history
// pages and live messages, including confirmations of our own posts.
// Hidden opens follow XIT BURN's pattern; see docs/contributing.md "Server Communication & ToS".
export async function fetchAgentChannel() {
  const { fetched, received, inaccessible, channelId } = agentChannelStore;
  if (fetched.value || inaccessible.value) {
    return;
  }
  received.value = false;
  const window = await showBuffer(channelCommand, {
    force: true,
    autoClose: true,
    closeWhen: computed(() => received.value),
  });
  if (!(await waitUntil(() => received.value, historyTimeout))) {
    channelId.value = undefined;
    inaccessible.value = true;
    received.value = true;
  }
  await waitNodeDisconnected(window);
}

// Chat has no form. It requires a delay after input changes, all three Enter events,
// and legacy keyCode/which values; an immediate keydown alone is ignored.
async function verifiedSend(input: HTMLInputElement, text: string) {
  focusElement(input);
  changeInputValue(input, text);
  await sleep(300);
  for (const type of ['keydown', 'keypress', 'keyup'] as const) {
    const event = new KeyboardEvent(type, {
      key: 'Enter',
      code: 'Enter',
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(event, 'keyCode', { get: () => 13 });
    Object.defineProperty(event, 'which', { get: () => 13 });
    input.dispatchEvent(event);
  }
  const deadline = Date.now() + 3000;
  while (input.value !== '' && Date.now() < deadline) {
    await sleep(100);
  }
  if (input.value !== '') {
    throw new Error('The game did not accept the message (chat input never cleared).');
  }
}

function getSystemMessageTexts(window: Element): string[] {
  const messages = _$(window, C.MessageList.messages);
  if (!messages) {
    return [];
  }
  return _$$(messages, C.Message.message)
    .filter(x => _$(x, C.Message.system))
    .map(x => _$(x, C.Message.text)?.textContent ?? '')
    .filter(x => x);
}

// An empty input confirms only client dispatch. Wait for C.Message.unconfirmed to leave
// the C.Message.text span. Acknowledgement normally takes 100-200ms; allow 5s for throttling.
async function waitForServerConfirmation(
  window: Element,
  text: string,
  systemMessageCountBefore: number,
) {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    const messages = _$(window, C.MessageList.messages);
    if (messages) {
      const texts = _$$(messages, C.Message.text);
      for (let i = texts.length - 1; i >= 0; i--) {
        const span = texts[i];
        if (span.textContent === text && !span.classList.contains(C.Message.unconfirmed)) {
          return;
        }
      }
    }
    await sleep(100);
  }
  const systemMessages = getSystemMessageTexts(window);
  const newest = systemMessages.slice(systemMessageCountBefore).at(-1);
  throw new Error(
    newest
      ? `The game did not confirm the message was received by the server: ${newest}`
      : 'The game did not confirm the message was received by the server.',
  );
}

async function waitForComposePrompt(window: Element) {
  const prompt = await Promise.race([
    $(window, C.Channel.prompt),
    (async () => {
      await watchUntil(agentChannelStore.inaccessible);
      return undefined;
    })(),
  ]);
  if (!prompt) {
    throw new Error(setupErrorMessage);
  }
  return prompt;
}

// The channel store receives the server message; wait for confirmation before continuing.
async function postMessageToOpenChannel(window: Element, input: HTMLInputElement, text: string) {
  const systemMessageCountBefore = getSystemMessageTexts(window).length;
  await verifiedSend(input, text);
  await waitForServerConfirmation(window, text, systemMessageCountBefore);
}

// Open a visible draft for the player to send. The channel store receives the actual sent text.
export async function openAgentChannelWithDraft(text: string) {
  const window = await showBuffer(channelCommand, {
    force: true,
  });
  const prompt = await waitForComposePrompt(window);
  const input = (await $(prompt, 'input')) as HTMLInputElement;
  focusElement(input);
  changeInputValue(input, text);
}

interface ChannelSession {
  window: Element;
  input: HTMLInputElement;
  close: () => void;
}

let session: ChannelSession | undefined;

// Reuse one hidden buffer per run to avoid slow opens and resetting the rendered history.
async function openChannelSession(): Promise<ChannelSession> {
  if (session?.window.isConnected && session.input.isConnected) {
    return session;
  }
  const closed = ref(false);
  const window = await showBuffer(channelCommand, {
    force: true,
    autoClose: true,
    closeWhen: computed(() => closed.value),
  });
  const close = () => (closed.value = true);
  try {
    const prompt = await waitForComposePrompt(window);
    const input = (await $(prompt, 'input')) as HTMLInputElement;
    session = { window, input, close };
    return session;
  } catch (e) {
    close();
    throw e;
  }
}

// Called when an action package run ends, however it ends.
export function closeAgentChannelSession() {
  const current = session;
  session = undefined;
  current?.close();
}

export async function postAgentMessage(text: string) {
  const { window, input } = await openChannelSession();
  await postMessageToOpenChannel(window, input, text);
}
