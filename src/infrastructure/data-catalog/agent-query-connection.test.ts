import { describe, expect, it, vi } from 'vitest';
import { createCollectionSource, DataCatalog } from '@src/core/data-query/catalog';
import {
  AgentQueryConnection,
  validateAgentEndpoint,
  validateAgentToken,
} from '@src/infrastructure/data-catalog/agent-query-connection';

class FakeSocket {
  readyState = 0;
  sent: string[] = [];
  closed?: { code?: number; reason?: string };
  private readonly listeners = new Map<string, Array<(event: { data?: unknown }) => void>>();

  addEventListener(type: string, listener: (event: { data?: unknown }) => void) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  send(data: string) {
    this.sent.push(data);
  }

  close(code?: number, reason?: string) {
    this.closed = { code, reason };
    this.readyState = 3;
  }

  emit(type: string, data?: unknown) {
    if (type === 'open') {
      this.readyState = 1;
    }
    for (const listener of this.listeners.get(type) ?? []) {
      listener({ data });
    }
  }

  messages() {
    return this.sent.map(x => JSON.parse(x));
  }
}

function createTestCatalog() {
  return new DataCatalog([
    createCollectionSource({
      id: 'test',
      label: 'Test',
      description: 'Test source.',
      provenance: 'prun-live',
      completeness: () => 'partial',
      snapshot: () => [{ id: 1 }, { id: 2 }],
      load: { execute: vi.fn() },
    }),
  ]);
}

const token = 'a'.repeat(32);

describe('agent endpoint and token validation', () => {
  it.each([
    ['ws://127.0.0.1:47800', 'ws://127.0.0.1:47800/'],
    ['ws://[::1]:47800/query', 'ws://[::1]:47800/query'],
  ])('accepts literal loopback endpoint %s', (endpoint, normalized) => {
    expect(validateAgentEndpoint(endpoint)).toBe(normalized);
  });

  it.each([
    'ws://localhost:47800',
    'ws://192.168.1.10:47800',
    'https://127.0.0.1:47800',
    'ws://user:secret@127.0.0.1:47800',
    'ws://127.0.0.1:47800?token=secret',
  ])('rejects unsafe endpoint %s', endpoint => {
    expect(() => validateAgentEndpoint(endpoint)).toThrow();
  });

  it('requires a substantial token without control characters', () => {
    expect(() => validateAgentToken('short')).toThrow();
    expect(() => validateAgentToken(`${token}\n`)).toThrow();
    expect(validateAgentToken(token)).toBeUndefined();
  });
});

describe('AgentQueryConnection', () => {
  it.each([0, 1])('checks UTF-8 request bytes at the size limit plus %s', extraBytes => {
    const socket = new FakeSocket();
    const catalog = createTestCatalog();
    const query = vi.spyOn(catalog, 'query');
    const connection = new AgentQueryConnection(catalog, () => socket);
    connection.connect('ws://127.0.0.1:47800', token);
    socket.emit('open');
    socket.emit('message', JSON.stringify({ type: 'authenticated' }));

    const message = JSON.stringify({
      type: 'query',
      id: 'utf8',
      query: { sourceId: 'test', search: '\u754c'.repeat(20000) },
    });
    const padding = 64 * 1024 - new TextEncoder().encode(message).byteLength + extraBytes;
    socket.emit('message', message + ' '.repeat(padding));
    expect(query).toHaveBeenCalledTimes(extraBytes === 0 ? 1 : 0);
    expect(connection.status.value).toBe(extraBytes === 0 ? 'connected' : 'error');
    connection.disconnect();
  });

  it.each(['x', '\u754c'])('checks UTF-8 response bytes for repeated %s', character => {
    const socket = new FakeSocket();
    const catalog = createTestCatalog();
    vi.spyOn(catalog.get('test')!, 'snapshot').mockReturnValue([
      { text: character.repeat(1500000) },
    ]);
    const connection = new AgentQueryConnection(catalog, () => socket);
    connection.connect('ws://127.0.0.1:47800', token);
    socket.emit('open');
    socket.emit('message', JSON.stringify({ type: 'authenticated' }));
    socket.emit(
      'message',
      JSON.stringify({ type: 'query', id: 'utf8', query: { sourceId: 'test' } }),
    );
    expect(socket.messages().at(-1)).toMatchObject({
      type: character === 'x' ? 'result' : 'error',
      id: 'utf8',
    });
    expect(new TextEncoder().encode(socket.sent.at(-1)).byteLength).toBeLessThanOrEqual(
      4 * 1024 * 1024,
    );
    connection.disconnect();
  });

  it('ignores a replaced socket closing after the new connection authenticates', () => {
    const first = new FakeSocket();
    const second = new FakeSocket();
    const factory = vi.fn().mockReturnValueOnce(first).mockReturnValueOnce(second);
    const connection = new AgentQueryConnection(createTestCatalog(), factory);
    connection.connect('ws://127.0.0.1:47800', token);
    first.emit('open');
    connection.connect('ws://127.0.0.1:47801', token);
    second.emit('open');
    second.emit('message', JSON.stringify({ type: 'authenticated' }));
    first.emit('close');
    expect(connection.status.value).toBe('connected');
    expect(connection.connectedEndpoint.value).toBe('ws://127.0.0.1:47801/');
    second.emit('close');
    expect(connection.status.value).toBe('disconnected');
    expect(connection.connectedEndpoint.value).toBe('');
  });

  it('authenticates when the page WebSocket constructor has branded static properties', () => {
    const nativeWebSocket = WebSocket;
    const proxiedWebSocket = new Proxy(nativeWebSocket, {
      get(target, property, receiver) {
        if (property === 'OPEN') {
          throw new TypeError('Illegal invocation');
        }
        return Reflect.get(target, property, receiver);
      },
    });
    vi.stubGlobal('WebSocket', proxiedWebSocket);

    try {
      const socket = new FakeSocket();
      const connection = new AgentQueryConnection(createTestCatalog(), () => socket);
      connection.connect('ws://127.0.0.1:47800', token);

      expect(() => socket.emit('open')).not.toThrow();
      expect(socket.messages()[0]).toMatchObject({ type: 'authenticate', token });
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('is disabled until explicitly connected and authenticates before querying', () => {
    const socket = new FakeSocket();
    const factory = vi.fn(() => socket);
    const connection = new AgentQueryConnection(createTestCatalog(), factory);

    expect(connection.status.value).toBe('disconnected');
    expect(factory).not.toHaveBeenCalled();

    connection.connect('ws://127.0.0.1:47800', token);
    expect(connection.status.value).toBe('connecting');
    socket.emit('open');
    expect(connection.status.value).toBe('authenticating');
    expect(socket.messages()[0]).toEqual({
      type: 'authenticate',
      version: 1,
      token,
    });

    socket.emit('message', JSON.stringify({ type: 'authenticated' }));
    expect(connection.status.value).toBe('connected');

    socket.emit(
      'message',
      JSON.stringify({ type: 'query', id: 'q1', query: { sourceId: 'test' } }),
    );
    const response = socket.messages()[1];
    expect(response.type).toBe('result');
    expect(response.id).toBe('q1');
    expect(response.result.source).toEqual({
      id: 'test',
      label: 'Test',
      provenance: 'prun-live',
      completeness: 'partial',
    });
    expect(response.result.rows).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('lists metadata but rejects loader and unknown request methods', () => {
    const socket = new FakeSocket();
    const connection = new AgentQueryConnection(createTestCatalog(), () => socket);
    connection.connect('ws://127.0.0.1:47800', token);
    socket.emit('open');
    socket.emit('message', JSON.stringify({ type: 'authenticated' }));

    socket.emit('message', JSON.stringify({ type: 'list-sources', id: 'list' }));
    expect(socket.messages()[1]).toMatchObject({
      type: 'sources',
      id: 'list',
      sources: [{ id: 'test', completeness: 'partial' }],
    });

    socket.emit('message', JSON.stringify({ type: 'load', id: 'load', sourceId: 'test' }));
    expect(socket.messages()[2]).toEqual({
      type: 'error',
      id: 'load',
      error: 'Unknown or unauthorized agent request type.',
    });
  });

  it('rejects requests before authentication and oversized messages', () => {
    const unauthenticatedSocket = new FakeSocket();
    const connection = new AgentQueryConnection(createTestCatalog(), () => unauthenticatedSocket);
    connection.connect('ws://127.0.0.1:47800', token);
    unauthenticatedSocket.emit('open');
    unauthenticatedSocket.emit(
      'message',
      JSON.stringify({ type: 'query', id: 'q1', query: { sourceId: 'test' } }),
    );
    expect(connection.status.value).toBe('error');
    expect(unauthenticatedSocket.closed?.code).toBe(1008);

    const oversizedSocket = new FakeSocket();
    const secondConnection = new AgentQueryConnection(createTestCatalog(), () => oversizedSocket);
    secondConnection.connect('ws://127.0.0.1:47800', token);
    oversizedSocket.emit('open');
    oversizedSocket.emit('message', 'x'.repeat(64 * 1024 + 1));
    expect(secondConnection.status.value).toBe('error');
    expect(oversizedSocket.closed?.code).toBe(1009);
  });

  it('shows validation failures without opening a socket and disconnects cleanly', () => {
    const socket = new FakeSocket();
    const factory = vi.fn(() => socket);
    const connection = new AgentQueryConnection(createTestCatalog(), factory);
    connection.connect('ws://example.com:47800', token);
    expect(connection.status.value).toBe('error');
    expect(factory).not.toHaveBeenCalled();

    connection.connect('ws://127.0.0.1:47800', token);
    socket.emit('open');
    socket.emit('message', JSON.stringify({ type: 'authenticated' }));
    connection.disconnect();
    expect(connection.status.value).toBe('disconnected');
    expect(socket.closed?.code).toBe(1000);
  });
});
