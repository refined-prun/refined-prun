/* eslint-disable @typescript-eslint/no-explicit-any */

type SocketIOProxyMessageType =
  | 'rprun-socket-io-listener-ready'
  | 'rprun-socket-io-message'
  | 'rprun-socket-io-message-apply';

interface SocketIOProxyMessage {
  type: SocketIOProxyMessageType;
  source: 'polling' | 'websocket';
  data: any;
  id: number;
  context?: string;
}
