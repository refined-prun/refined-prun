import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@src/utils/dayjs';
import { dispatch } from '@src/infrastructure/prun-api/data/api-messages';
import {
  agentChannelStore,
  channelIdentifier,
} from '@src/infrastructure/prun-api/data/agent-channel';
import { fetchAgentChannel } from '@src/infrastructure/prun-ui/agent-channel-messaging';
import { agentReadyPackages } from '@src/features/XIT/ACT/agent-sync';

const mocks = vi.hoisted(() => ({ showBuffer: vi.fn() }));

vi.mock('@src/infrastructure/prun-ui/buffers', () => ({ showBuffer: mocks.showBuffer }));
vi.mock('@src/infrastructure/shell/config', () => ({ default: {} }));

function packageMessage(id: string, channelId: string): PrunApi.ChannelMessage {
  return {
    messageId: `message-${id}`,
    type: 'CHAT',
    sender: null,
    message: JSON.stringify({
      k: 'ap',
      v: 1,
      i: id,
      p: { g: { n: 'Auto Offload' }, r: [], a: [] },
    }),
    time: { timestamp: Date.now() },
    channelId,
    deletingUser: null,
  };
}

function channelMessages(channelId: string, messages: PrunApi.ChannelMessage[]) {
  return {
    type: 'CHANNEL_MESSAGE_LIST',
    data: { channelId, messages, hasMore: false },
  };
}

function membershipData(channelId: string): PrunApi.ChannelClientMembership {
  return {
    type: 'GROUP',
    identifier: channelIdentifier,
    channelId,
    joined: true,
    muted: false,
    readUntil: { timestamp: Date.now() },
    lastActivity: { timestamp: Date.now() },
  };
}

function channelMembership(channelId: string) {
  return { type: 'CHANNEL_CLIENT_MEMBERSHIP', data: membershipData(channelId) };
}

function channelList(channelId: string) {
  return {
    type: 'CHANNEL_CHANNEL_LIST',
    data: { channels: [membershipData(channelId)] },
  };
}

describe('agent channel ingestion', () => {
  beforeEach(() => {
    mocks.showBuffer.mockReset();
    dispatch({ type: 'CLIENT_CONNECTION_OPENED' });
  });

  it('ignores unrelated history before ingesting a requested refined-agent channel', async () => {
    dispatch(channelMessages('other-channel', [packageMessage('wrong', 'other-channel')]));

    expect(agentChannelStore.fetched.value).toBe(false);
    expect(agentReadyPackages.value).toEqual([]);

    const targetChannel = 'refined-agent-channel';
    dispatch(channelList(targetChannel));
    mocks.showBuffer.mockImplementation(async () => {
      dispatch(
        channelMessages(
          targetChannel,
          ['a2-1', 'a2-2', 'a2-3', 'a2-4'].map(x => packageMessage(x, targetChannel)),
        ),
      );
      return { isConnected: false } as Element;
    });
    await fetchAgentChannel();

    expect(agentChannelStore.channelId.value).toBe(targetChannel);
    expect(agentReadyPackages.value.map(x => x.id)).toEqual(['a2-1', 'a2-2', 'a2-3', 'a2-4']);
  });

  it('uses refined-agent membership to identify later history', () => {
    const targetChannel = 'refined-agent-channel';
    dispatch(channelMembership(targetChannel));
    dispatch(channelMessages(targetChannel, [packageMessage('a2', targetChannel)]));

    expect(agentChannelStore.channelId.value).toBe(targetChannel);
    expect(agentReadyPackages.value.map(x => x.id)).toEqual(['a2']);
  });

  it('keeps newer packages and completion markers when older history arrives', () => {
    const targetChannel = 'refined-agent-channel';
    const completed = packageMessage('a2', targetChannel);
    completed.time.timestamp -= 2000;
    const marker = {
      ...packageMessage('marker', targetChannel),
      message: 'a2',
    };
    const pending = packageMessage('b2', targetChannel);
    dispatch(channelMembership(targetChannel));
    dispatch(channelMessages(targetChannel, [completed, marker, pending]));

    expect(agentReadyPackages.value.map(x => x.id)).toEqual(['b2']);

    dispatch(channelMessages(targetChannel, [completed]));

    expect(agentReadyPackages.value.map(x => x.id)).toEqual(['b2']);
    expect(agentChannelStore.all.value).toHaveLength(3);
  });

  it('merges overlapping history pages by message ID', () => {
    const targetChannel = 'refined-agent-channel';
    const first = packageMessage('a2', targetChannel);
    const second = packageMessage('b2', targetChannel);
    dispatch(channelMembership(targetChannel));
    dispatch(channelMessages(targetChannel, [first]));
    dispatch(channelMessages(targetChannel, [first, second]));
    dispatch(channelMessages(targetChannel, []));

    expect(agentReadyPackages.value.map(x => x.id)).toEqual(['a2', 'b2']);
    expect(agentChannelStore.all.value).toHaveLength(2);
  });

  it('updates ready packages from live packages and completion markers', () => {
    const targetChannel = 'refined-agent-channel';
    const pkg = packageMessage('a2', targetChannel);
    pkg.time.timestamp -= 2000;
    dispatch(channelMembership(targetChannel));
    dispatch(channelMessages(targetChannel, []));
    dispatch({ type: 'CHANNEL_MESSAGE_ADDED', data: pkg });

    expect(agentReadyPackages.value.map(x => x.id)).toEqual(['a2']);

    dispatch({
      type: 'CHANNEL_MESSAGE_ADDED',
      data: { ...packageMessage('marker', targetChannel), message: 'a2' },
    });

    expect(agentReadyPackages.value).toEqual([]);
  });

  it('ignores live messages without matching agent channel membership', () => {
    const targetChannel = 'refined-agent-channel';
    dispatch({ type: 'CHANNEL_MESSAGE_ADDED', data: packageMessage('a2', targetChannel) });
    dispatch(channelMembership(targetChannel));
    dispatch(channelMessages(targetChannel, []));
    dispatch({ type: 'CHANNEL_MESSAGE_ADDED', data: packageMessage('b2', 'other-channel') });

    expect(agentChannelStore.all.value).toEqual([]);
  });

  it('retains live messages received before history without marking history fetched', async () => {
    const targetChannel = 'refined-agent-channel';
    dispatch(channelMembership(targetChannel));
    dispatch({ type: 'CHANNEL_MESSAGE_ADDED', data: packageMessage('a2', targetChannel) });

    expect(agentChannelStore.fetched.value).toBe(false);

    mocks.showBuffer.mockImplementation(async () => {
      dispatch(channelMessages(targetChannel, [packageMessage('b2', targetChannel)]));
      return { isConnected: false } as Element;
    });
    await fetchAgentChannel();

    expect(mocks.showBuffer).toHaveBeenCalledOnce();
    expect(agentReadyPackages.value.map(x => x.id)).toEqual(['a2', 'b2']);
  });

  it('keeps one server message when live delivery and history overlap', () => {
    const targetChannel = 'refined-agent-channel';
    const pkg = packageMessage('a2', targetChannel);
    dispatch(channelMembership(targetChannel));
    dispatch(channelMessages(targetChannel, []));
    dispatch({ type: 'CHANNEL_MESSAGE_ADDED', data: pkg });
    dispatch({ type: 'CHANNEL_MESSAGE_ADDED', data: pkg });
    dispatch(channelMessages(targetChannel, [pkg]));

    expect(agentChannelStore.all.value).toEqual([pkg]);
    expect(agentReadyPackages.value.map(x => x.messageId)).toEqual([pkg.messageId]);
  });

  it('ignores unrelated history while a request has no channel identity yet', async () => {
    const targetChannel = 'refined-agent-channel';
    mocks.showBuffer.mockImplementation(async () => {
      dispatch(channelMessages('other-channel', [packageMessage('wrong', 'other-channel')]));

      expect(agentChannelStore.channelId.value).toBeUndefined();
      expect(agentChannelStore.fetched.value).toBe(false);
      expect(agentReadyPackages.value).toEqual([]);

      dispatch(channelMembership(targetChannel));
      dispatch(channelMessages(targetChannel, [packageMessage('a2', targetChannel)]));
      return { isConnected: false } as Element;
    });

    await fetchAgentChannel();

    expect(agentReadyPackages.value.map(x => x.id)).toEqual(['a2']);
  });

  it('routes an in-flight history request after a reconnect', async () => {
    const targetChannel = 'refined-agent-channel';
    mocks.showBuffer.mockImplementation(async () => {
      dispatch({ type: 'CLIENT_CONNECTION_OPENED' });
      dispatch(channelList(targetChannel));
      dispatch(channelMessages('other-channel', [packageMessage('wrong', 'other-channel')]));

      expect(agentChannelStore.channelId.value).toBe(targetChannel);
      expect(agentChannelStore.fetched.value).toBe(false);
      expect(agentReadyPackages.value).toEqual([]);

      dispatch(channelMessages(targetChannel, [packageMessage('a2', targetChannel)]));
      return { isConnected: false } as Element;
    });

    await fetchAgentChannel();

    expect(agentChannelStore.channelId.value).toBe(targetChannel);
    expect(agentReadyPackages.value.map(x => x.id)).toEqual(['a2']);
  });

  it('fails closed instead of hanging when target history precedes channel identity', async () => {
    vi.useFakeTimers();
    try {
      const targetChannel = 'refined-agent-channel';
      mocks.showBuffer.mockImplementation(async () => {
        dispatch(channelMessages(targetChannel, [packageMessage('wrong-order', targetChannel)]));
        dispatch(channelMembership(targetChannel));
        return { isConnected: false } as Element;
      });

      const request = fetchAgentChannel();
      await vi.advanceTimersByTimeAsync(5000);
      await request;

      expect(agentChannelStore.channelId.value).toBeUndefined();
      expect(agentChannelStore.inaccessible.value).toBe(true);
      expect(agentChannelStore.fetched.value).toBe(false);
      expect(agentReadyPackages.value).toEqual([]);
    } finally {
      vi.useRealTimers();
    }
  });
});
