import { decodePayload, encodePayload, Packet as EIOPacket } from 'engine.io-parser';
import { Decoder, Encoder, Packet as SIOPacket, PacketType } from 'socket.io-parser';
import { castArray } from '@src/utils/cast-array';

export type Middleware<T> = {
  onOpen: () => void;
  onMessage: (payload: T) => boolean;
  dispatchClientMessage: ((payload: T) => void) | undefined;
};

export default function socketIOMiddleware<T>(middleware: Middleware<T>) {
  const addEventListener = WebSocket.prototype.addEventListener;
  window.WebSocket = new Proxy(WebSocket, {
    construct(target: typeof WebSocket, args: [string, (string | string[])?]) {
      const ws = new target(...args);

      return new Proxy(ws, {
        set(target, prop, value) {
          if (prop === 'onmessage') {
            middleware.dispatchClientMessage = message => {
              value(new MessageEvent('message', { data: encodeMessage(message) }));
            };
            target.onmessage = e => {
              const data = processMessage(e.data, middleware);
              if (data !== e.data) {
                e = new Proxy(e, {
                  get(target, prop) {
                    if (prop === 'data') {
                      return data;
                    }
                    return Reflect.get(target, prop);
                  },
                });
              }
              value(e);
            };
            return true;
          }
          return Reflect.set(target, prop, value);
        },
        get(target, prop) {
          if (prop === 'addEventListener') {
            return addEventListener.bind(target);
          }
          const value = Reflect.get(target, prop);
          if (typeof value === 'function') {
            return value.bind(target);
          }
          return value;
        },
      });
    },
  });

  // I don't remember what this override is for, lol. Probably some FIO compatibility issues.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  WebSocket.prototype.addEventListener = function (type: any, listener: any, options: any) {
    return this.addEventListener(type, listener, options);
  };

  window.XMLHttpRequest = new Proxy(XMLHttpRequest, {
    construct(target: typeof XMLHttpRequest) {
      const xhr = new target();
      let data = '';

      return new Proxy(xhr, {
        get(target, prop) {
          if (prop === 'responseText' && data) {
            return data;
          }
          const value = Reflect.get(target, prop);
          if (typeof value === 'function') {
            return value.bind(target);
          }
          return value;
        },
        set(target, prop, value) {
          if (prop === 'onreadystatechange') {
            target.onreadystatechange = () => {
              if (target.readyState === 4 && target.status === 200) {
                data = processMessage(target.responseText, middleware);
              }
              value();
            };
            return true;
          }
          return Reflect.set(target, prop, value);
        },
      });
    },
  });
}

function processMessage<T>(data: string, middleware: Middleware<T>) {
  const engineIOPackets = decodePayload(data);
  let rewriteMessage = false;
  for (const engineIOPacket of engineIOPackets) {
    if (engineIOPacket.type !== 'message') {
      continue;
    }
    const decoder = new Decoder();
    decoder.on('decoded', decodedPacket => {
      const data = decodedPacket.data;
      if (decodedPacket.type === 0) {
        try {
          middleware.onOpen();
        } catch (error) {
          console.error(error);
        }
        return;
      }
      const payload = data[1];
      if (decodedPacket.type !== 2 || data[0] !== 'event' || payload === undefined) {
        return;
      }

      let rewrite: boolean;
      try {
        rewrite = middleware.onMessage(payload);
      } catch (error) {
        console.error(error);
        rewrite = false;
      }
      if (rewrite) {
        engineIOPacket.data = encodeSIOPacket(decodedPacket);
        rewriteMessage = true;
      }
    });
    decoder.add(engineIOPacket.data);
  }
  return rewriteMessage ? encodeEIOPacket(engineIOPackets) : data;
}

function encodeMessage<T>(message: T) {
  return encodeEIOPacket({
    type: 'message',
    data: encodeSIOPacket({
      type: PacketType.EVENT,
      nsp: '/',
      data: ['event', message],
    }),
  });
}

function encodeSIOPacket(packet: SIOPacket) {
  const encoder = new Encoder();
  return encoder.encode(packet)[0];
}

function encodeEIOPacket(packet: Arrayable<EIOPacket>) {
  let data: string;
  encodePayload(castArray(packet), newData => {
    data = newData;
  });
  return data!;
}
