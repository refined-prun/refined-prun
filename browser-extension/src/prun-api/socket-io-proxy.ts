/* eslint-disable @typescript-eslint/no-explicit-any */
(function () {
  if (window['REFINED_PRUN'] === true) {
    console.debug('Refined PrUn: Already added socket.io proxy');
    return;
  }

  window['REFINED_PRUN'] = true;

  interface PendingMessage {
    id: number;
    context?: string;
    xhr?: {
      data: string;
      callback: (ev: string) => void;
    };
    websocket?: {
      event: MessageEvent;
      callback: (ev: MessageEvent) => void;
    };
  }

  let listenerReady = false;
  let queuedMessages: PendingMessage[] = [];
  const pendingCallbacks: Map<number, PendingMessage> = new Map();
  let callbackId = 0;

  window.addEventListener('message', (event: MessageEvent<SocketIOProxyMessage>) => {
    if (event.source !== window) {
      return;
    }
    if (event.data.type === 'rprun-socket-io-listener-ready') {
      listenerReady = true;
      for (const event of queuedMessages) {
        forwardMessage(event);
      }
      queuedMessages = [];
    }
    if (event.data.type === 'rprun-socket-io-message-apply') {
      applyMessage(event.data);
    }
  });

  function applyMessage(apply: SocketIOProxyMessage) {
    const message = pendingCallbacks.get(apply.id);
    pendingCallbacks.delete(apply.id);

    if (message === undefined) {
      return;
    }

    if (message.xhr !== undefined) {
      message.xhr.callback(apply.data);
    }

    if (message.websocket !== undefined) {
      const websocket = message.websocket;
      if (apply.data !== websocket.event.data) {
        const eventProxy = new Proxy(websocket.event, {
          get(target, prop) {
            if (prop === 'data') {
              return apply.data;
            }
            return Reflect.get(target, prop);
          },
        });
        websocket.callback(eventProxy);
      } else {
        websocket.callback(websocket.event);
      }
    }
  }

  function forwardMessage(message: PendingMessage) {
    if (!listenerReady) {
      queuedMessages.push(message);
      return;
    }

    pendingCallbacks.set(message.id, message);
    window.postMessage(
      <SocketIOProxyMessage>{
        type: 'rprun-socket-io-message',
        id: message.id,
        data: message.websocket?.event.data ?? message.xhr?.data,
        context: message.context,
      },
      '*',
    );
  }

  function getContext() {
    const url = window.location.href;
    const match = url.match(/.*context=(?<Context>[0-9a-fA-F]{32})/);
    if (match && match.groups && Object.hasOwn(match.groups, 'Context')) {
      return '"' + match.groups['Context'] + '"';
    } else {
      return undefined;
    }
  }

  const addEventListener = WebSocket.prototype.addEventListener;
  window.WebSocket = new Proxy(WebSocket, {
    construct(target: typeof WebSocket, args: [string, (string | string[])?]) {
      const ws = new target(...args);

      return new Proxy(ws, {
        set(target, prop, value) {
          if (prop === 'onmessage') {
            target.onmessage = ev => {
              forwardMessage({
                id: callbackId++,
                context: getContext(),
                websocket: {
                  event: ev,
                  callback: value,
                },
              });
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

  WebSocket.prototype.addEventListener = function (type: any, listener: any, options: any) {
    return this.addEventListener(type, listener, options);
  };

  window.XMLHttpRequest = new Proxy(XMLHttpRequest, {
    construct(target: typeof XMLHttpRequest) {
      const xhr = new target();
      let data: any;

      return new Proxy(xhr, {
        get(target, prop) {
          if (prop === 'responseText' && data !== undefined) {
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
              if (target.readyState !== 4) {
                value();
                return;
              }
              if (!(target.status === 200 || target.status === 1223)) {
                value();
                return;
              }
              forwardMessage({
                id: callbackId++,
                context: getContext(),
                xhr: {
                  data: target.responseText,
                  callback: newData => {
                    data = newData;
                    value();
                  },
                },
              });
            };
            return true;
          }
          return Reflect.set(target, prop, value);
        },
      });
    },
  });

  console.log('Refined PrUn: Added socket.io proxy');
})();
