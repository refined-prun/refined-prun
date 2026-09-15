import { DataCatalog } from '@src/core/data-query/catalog';
import { DataQuery } from '@src/core/data-query/types';
import { nativeWebSocket } from '@src/infrastructure/prun-api/socket-io-middleware';
import { ref } from 'vue';

export type AgentConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'authenticating'
  | 'connected'
  | 'error';

interface AgentSocketEvent {
  data?: unknown;
}

interface AgentSocket {
  readonly readyState: number;
  addEventListener(type: string, listener: (event: AgentSocketEvent) => void): void;
  send(data: string): void;
  close(code?: number, reason?: string): void;
}

type AgentSocketFactory = (endpoint: string) => AgentSocket;

interface AgentRequest {
  id?: unknown;
  type?: unknown;
  query?: unknown;
}

const maxIncomingMessageSize = 64 * 1024;
const maxOutgoingMessageSize = 4 * 1024 * 1024;
const textEncoder = new TextEncoder();
const authenticationTimeoutMs = 10_000;
const protocolVersion = 1;
// WebSocket.OPEN, inlined so the page's proxied constructor is never read from.
const webSocketOpen = 1;

export class AgentQueryConnection {
  readonly status = ref<AgentConnectionStatus>('disconnected');
  readonly lastError = ref('');
  readonly connectedEndpoint = ref('');

  private socket?: AgentSocket;
  private authenticated = false;
  private authenticationTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly catalog: DataCatalog,
    private readonly socketFactory: AgentSocketFactory = endpoint =>
      new nativeWebSocket(endpoint) as unknown as AgentSocket,
  ) {}

  connect(endpoint: string, token: string) {
    this.disconnect();
    this.lastError.value = '';

    let validatedEndpoint: string;
    try {
      validatedEndpoint = validateAgentEndpoint(endpoint);
      validateAgentToken(token);
    } catch (error) {
      this.fail(getErrorMessage(error));
      return;
    }

    this.status.value = 'connecting';
    this.connectedEndpoint.value = validatedEndpoint;
    let authenticationToken = token;

    try {
      const socket = this.socketFactory(validatedEndpoint);
      this.socket = socket;
      socket.addEventListener('open', () => {
        if (socket !== this.socket) {
          return;
        }
        this.status.value = 'authenticating';
        this.sendRaw({
          type: 'authenticate',
          version: protocolVersion,
          token: authenticationToken,
        });
        authenticationToken = '';
        this.authenticationTimer = setTimeout(() => {
          if (!this.authenticated) {
            this.failAndClose('Agent authentication timed out.');
          }
        }, authenticationTimeoutMs);
      });
      socket.addEventListener('message', event => {
        if (socket === this.socket) {
          this.handleMessage(event.data);
        }
      });
      socket.addEventListener('error', () => {
        if (socket === this.socket) {
          this.failAndClose('Agent connection failed.', 1011);
        }
      });
      socket.addEventListener('close', () => {
        if (socket !== this.socket) {
          return;
        }
        this.clearAuthenticationTimer();
        this.socket = undefined;
        this.authenticated = false;
        this.connectedEndpoint.value = '';
        if (this.status.value !== 'error') {
          this.status.value = 'disconnected';
        }
      });
    } catch (error) {
      authenticationToken = '';
      this.fail(getErrorMessage(error));
    }
  }

  disconnect() {
    this.clearAuthenticationTimer();
    this.authenticated = false;
    this.connectedEndpoint.value = '';
    const socket = this.socket;
    this.socket = undefined;
    socket?.close(1000, 'Disconnected by user');
    this.status.value = 'disconnected';
    this.lastError.value = '';
  }

  private handleMessage(data: unknown) {
    if (typeof data !== 'string') {
      this.failAndClose('Only text agent messages are supported.', 1003);
      return;
    }
    if (textEncoder.encode(data).byteLength > maxIncomingMessageSize) {
      this.failAndClose('Agent message exceeds the size limit.', 1009);
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(data) as unknown;
    } catch {
      this.sendError(undefined, 'Malformed JSON message.');
      return;
    }
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      this.sendError(undefined, 'Message must be an object.');
      return;
    }
    const message = parsed as AgentRequest;

    if (!this.authenticated) {
      if (message.type !== 'authenticated') {
        this.failAndClose('Agent sent a request before authentication.', 1008);
        return;
      }
      this.clearAuthenticationTimer();
      this.authenticated = true;
      this.status.value = 'connected';
      this.lastError.value = '';
      return;
    }

    if (typeof message.id !== 'string' || message.id.length === 0 || message.id.length > 128) {
      this.sendError(undefined, 'Request id must be a string between 1 and 128 characters.');
      return;
    }

    switch (message.type) {
      case 'list-sources':
        this.sendRaw({
          type: 'sources',
          id: message.id,
          sources: this.catalog.list(),
        });
        break;
      case 'query':
        this.handleQuery(message.id, message.query);
        break;
      default:
        this.sendError(message.id, 'Unknown or unauthorized agent request type.');
        break;
    }
  }

  private handleQuery(id: string, query: unknown) {
    try {
      const result = this.catalog.query(query as DataQuery);
      this.sendRaw({ type: 'result', id, result }, id);
    } catch (error) {
      this.sendError(id, getErrorMessage(error));
    }
  }

  private sendError(id: string | undefined, message: string) {
    this.sendRaw({
      type: 'error',
      ...(id ? { id } : {}),
      error: message,
    });
  }

  private sendRaw(message: object, requestId?: string) {
    const socket = this.socket;
    if (!socket || socket.readyState !== webSocketOpen) {
      return;
    }
    const serialized = JSON.stringify(message);
    if (textEncoder.encode(serialized).byteLength > maxOutgoingMessageSize) {
      const fallback = JSON.stringify({
        type: 'error',
        ...(requestId ? { id: requestId } : {}),
        error: 'Agent response exceeds the size limit. Narrow the query or reduce its limit.',
      });
      socket.send(fallback);
      return;
    }
    socket.send(serialized);
  }

  private failAndClose(message: string, code = 1008) {
    this.fail(message);
    const socket = this.socket;
    this.socket = undefined;
    socket?.close(code, 'Agent protocol error');
  }

  private fail(message: string) {
    this.clearAuthenticationTimer();
    this.authenticated = false;
    this.status.value = 'error';
    this.lastError.value = message;
    this.connectedEndpoint.value = '';
  }

  private clearAuthenticationTimer() {
    if (this.authenticationTimer !== undefined) {
      clearTimeout(this.authenticationTimer);
      this.authenticationTimer = undefined;
    }
  }
}

export function validateAgentEndpoint(endpoint: string) {
  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    throw Error('Agent endpoint must be a valid WebSocket URL.');
  }
  if (url.protocol !== 'ws:' && url.protocol !== 'wss:') {
    throw Error('Agent endpoint must use ws:// or wss://.');
  }
  if (url.hostname !== '127.0.0.1' && url.hostname !== '[::1]') {
    throw Error('Agent endpoint must use the literal loopback address 127.0.0.1 or [::1].');
  }
  if (url.username || url.password || url.search || url.hash) {
    throw Error('Agent endpoint must not contain credentials, query parameters, or a fragment.');
  }
  return url.toString();
}

export function validateAgentToken(token: string) {
  if (typeof token !== 'string' || token.length < 32 || token.length > 256) {
    throw Error('Agent token must contain between 32 and 256 characters.');
  }
  if ([...token].some(x => x.charCodeAt(0) <= 31 || x.charCodeAt(0) === 127)) {
    throw Error('Agent token must not contain control characters.');
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
