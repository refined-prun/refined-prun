import { decodePayload, encodePayload, Packet as EIOPacket } from 'engine.io-parser';
import { Decoder, Encoder, Packet as SIOPacket, PacketType } from 'socket.io-parser';
import { castArray } from '@src/utils/cast-array';

export type Middleware<T> = {
  onOpen: () => void;
  onMessage: (payload: T) => Promise<boolean>;
  dispatchClientMessage: Ref<((payload: T) => void) | undefined>;
};

export default function socketIOMiddleware<T>(middleware: Middleware<T>) {
  const addEventListener = WebSocket.prototype.addEventListener;
  window.WebSocket = new Proxy(WebSocket, {
    construct(target: typeof WebSocket, args: [string, (string | string[])?]) {
      const ws = new target(...args);

      return new Proxy(ws, {
        set(target, prop, value) {
          if (prop === 'onmessage') {
            middleware.dispatchClientMessage.value = message => {
              value(new MessageEvent('message', { data: encodeMessage(message) }));
            };
            target.onmessage = async e => {
              const data = await processMessage(e.data, middleware);
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
            target.onreadystatechange = async () => {
              if (target.readyState === 4 && target.status === 200) {
                data = await processMessage(target.responseText, middleware);
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

async function processMessage<T>(data: string, middleware: Middleware<T>) {
  const engineIOPackets = decodePayload(data);
  const rewrite = await Promise.all(
    engineIOPackets.map(packet => processEngineIOPacket(packet, middleware)),
  );
  return rewrite.some(x => x) ? encodeEIOPacket(engineIOPackets) : data;
}

async function processEngineIOPacket<T>(packet: EIOPacket, middleware: Middleware<T>) {
  if (packet.type !== 'message') {
    return false;
  }

  const decodedPacket = decodeSIOPacket(packet.data);
  if (!decodedPacket) {
    console.error(`Failed to decode packet: ${packet.data}`);
    return false;
  }

  const data = decodedPacket.data;
  if (decodedPacket.type === 0) {
    try {
      middleware.onOpen();
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  const payload = data[1];
  if (decodedPacket.type !== 2 || data[0] !== 'event' || payload === undefined) {
    return false;
  }

  let rewrite: boolean;
  try {
    rewrite = await middleware.onMessage(payload);
  } catch (error) {
    console.error(error);
    rewrite = false;
  }
  if (rewrite) {
    packet.data = encodeSIOPacket(decodedPacket);
  }
  return rewrite;
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

function decodeSIOPacket(data: unknown) {
  const decoder = new Decoder();
  let decodedPacket: SIOPacket | undefined;
  decoder.on('decoded', x => (decodedPacket = x));
  decoder.add(data);
  return decodedPacket;
}

function encodeEIOPacket(packet: Arrayable<EIOPacket>) {
  let data: string;
  encodePayload(castArray(packet), newData => {
    data = newData;
  });
  return data!;
}
