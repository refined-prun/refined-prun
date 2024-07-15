/* eslint-disable @typescript-eslint/no-explicit-any */
(function () {
  if (window['REFINED_PRUN'] === true) {
    console.debug('Already injected WebSocket interceptor');
    return;
  }

  window['REFINED_PRUN'] = true;

  interface PendingMessage {
    id: number;
    event: MessageEvent;
    callback: (ev: MessageEvent) => void;
    context?: string;
  }

  let listenerReady = false;
  let queuedEvents: PendingMessage[] = [];
  const pendingCallbacks: Map<number, PendingMessage> = new Map();
  let callbackId = 0;

  window.addEventListener('message', event => {
    if (event.source !== window) {
      return;
    }
    if (event.data.type === 'rprun-listener-ready') {
      listenerReady = true;
      for (const event of queuedEvents) {
        forwardMessage(event);
      }
      queuedEvents = [];
    }
    if (event.data.type === 'rprun-message-processed') {
      const data = <WebSocketWindowMessage>event.data;
      const message = pendingCallbacks.get(data.id);
      pendingCallbacks.delete(data.id);
      if (message === undefined || data.reject) {
        return;
      }

      if (data.override) {
        const eventProxy = new Proxy(message.event, {
          get(target, prop) {
            if (prop === 'data') {
              return data.data;
            }
            return Reflect.get(target, prop);
          },
        });
        message.callback(eventProxy);
      } else {
        message.callback(message.event);
      }
    }
  });

  function forwardMessage(event: PendingMessage) {
    if (!listenerReady) {
      queuedEvents.push(event);
      return;
    }

    pendingCallbacks.set(event.id, event);
    window.postMessage(
      <WebSocketWindowMessage>{
        type: 'rprun-message-received',
        id: event.id,
        data: event.event.data,
        context: event.context,
      },
      '*',
    );
  }

  function interceptor(this: WebSocket, listener: (this: WebSocket, ev: MessageEvent) => any, ev: MessageEvent) {
    const url = window.location.href;
    const match = url.match(/.*context=(?<Context>[0-9a-fA-F]{32})/);

    let context: string | undefined;
    if (match && match.groups && Object.hasOwn(match.groups, 'Context')) {
      context = '"' + match.groups['Context'] + '"';
    } else {
      context = undefined;
    }

    forwardMessage({
      id: callbackId++,
      event: ev,
      callback: listener.bind(this),
      context,
    });
  }

  window.WebSocket = new Proxy(WebSocket, {
    construct(target: typeof WebSocket, args: [string, (string | string[])?]) {
      const ws = new target(...args);

      return new Proxy(ws, {
        set(target, prop, value) {
          if (prop === 'onmessage') {
            target.onmessage = interceptor.bind(target, value);
            return true;
          }
          return Reflect.set(target, prop, value);
        },
        get(target, prop) {
          if (prop === 'send') {
            // Wtf, why doesn't it work with `Reflect.get`???
            return target.send.bind(target);
          }
          return Reflect.get(target, prop);
        },
      });
    },
  });

  console.log('Refined PrUn: Injected WebSocket interceptor');
})();
