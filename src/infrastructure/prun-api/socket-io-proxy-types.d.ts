/* eslint-disable @typescript-eslint/no-explicit-any */

type SocketIOProxyMessageType = 'rp-socket-io-message' | 'rp-socket-io-message-apply';

interface SocketIOProxyMessage {
  type: SocketIOProxyMessageType;
  data: any;
  id: number;
  context?: string;
}
