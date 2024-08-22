/* eslint-disable @typescript-eslint/no-explicit-any */

type SocketIOProxyMessageType =
  | 'rp-socket-io-listener-ready'
  | 'rp-socket-io-message'
  | 'rp-socket-io-message-apply';

interface SocketIOProxyMessage {
  type: SocketIOProxyMessageType;
  source: 'polling' | 'websocket';
  data: any;
  id: number;
  context?: string;
}
