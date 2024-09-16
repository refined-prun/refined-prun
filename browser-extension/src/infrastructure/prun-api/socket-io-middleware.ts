import { decodePayload, encodePayload } from 'engine.io-parser';
import { Decoder, Encoder } from 'socket.io-parser';

type Middleware<T> = (context: string | undefined, packet: T) => boolean;

export default function socketIOMiddleware<T>(middleware: Middleware<T>) {
  window.addEventListener('message', (event: MessageEvent<SocketIOProxyMessage>) => {
    if (event.source !== window) {
      return;
    }
    if (event.data.type === 'rp-socket-io-message') {
      const message = event.data;
      const data = processMessage(message, middleware);
      window.postMessage(
        <SocketIOProxyMessage>{
          type: 'rp-socket-io-message-apply',
          id: message.id,
          data,
        },
        '*',
      );
    }
  });

  const readyAttribute = 'rp-socket-io-proxy-ready';
  function checkReadyAttribute() {
    if (!document.documentElement.hasAttribute(readyAttribute)) {
      return false;
    }

    window.postMessage(
      {
        type: 'rp-socket-io-listener-ready',
      },
      '*',
    );
    document.documentElement.removeAttribute(readyAttribute);
    return true;
  }

  if (!checkReadyAttribute()) {
    const observer = new MutationObserver(() => {
      if (checkReadyAttribute()) {
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, { attributes: true });
  }
}

function processMessage<T>(message: SocketIOProxyMessage, middleware: Middleware<T>) {
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

      if (middleware(message.context, payload)) {
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
