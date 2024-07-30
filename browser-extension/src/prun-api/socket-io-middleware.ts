import { decodePayload, encodePayload } from 'engine.io-parser';
import { Decoder, Encoder } from 'socket.io-parser';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Middleware = (context: string | undefined, packet: any) => boolean;

export function socketIOMiddleware(middleware: Middleware) {
  window.addEventListener('message', (event: MessageEvent<SocketIOProxyMessage>) => {
    if (event.source !== window) {
      return;
    }
    if (event.data.type === 'rprun-socket-io-message') {
      const message = event.data;
      const data = processMessage(message, middleware);
      window.postMessage(
        <SocketIOProxyMessage>{
          type: 'rprun-socket-io-message-apply',
          id: message.id,
          data,
        },
        '*',
      );
    }
  });

  window.postMessage(
    {
      type: 'rprun-socket-io-listener-ready',
    },
    '*',
  );
}

function processMessage(message: SocketIOProxyMessage, middleware: Middleware) {
  let data = message.data;
  const engineIOPackets = decodePayload(data);
  let rewriteMessage = false;
  for (const engineIOPacket of engineIOPackets) {
    if (engineIOPacket.type !== 'message') {
      continue;
    }
    const decoder = new Decoder();
    decoder.on('decoded', decodedPacket => {
      const data = decodedPacket.data;
      const payload = data[1];
      if (data[0] !== 'event' || payload === undefined) {
        return;
      }

      if (middleware(message.context, data[1])) {
        const encoder = new Encoder();
        engineIOPacket.data = encoder.encode(decodedPacket)[0];
        rewriteMessage = true;
      }
    });
    decoder.add(engineIOPacket.data);
  }
  if (rewriteMessage) {
    encodePayload(engineIOPackets, newData => {
      data = newData;
    });
  }
  return data;
}
