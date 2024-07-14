(function () {
  if (window['RPRUN_COLLECTOR_HAS_RUN'] === true) {
    console.debug('Already injected websocket rebinding');
    return;
  }

  window['RPRUN_COLLECTOR_HAS_RUN'] = true;
  let pendingMessages: WindowMessage[] = [];
  let listenerReady = false;

  window.addEventListener('message', event => {
    if (event.source !== window) {
      return;
    }
    if (event.data.type === 'rprun-listener-ready') {
      listenerReady = true;
      for (const message of pendingMessages) {
        sendWindowMessage(message);
      }
      pendingMessages = [];
    }
  });

  function sendWindowMessage(data: WindowMessage) {
    if (!listenerReady) {
      pendingMessages.push(data);
      return;
    }

    window.postMessage(
      {
        type: 'rprun-window-message',
        data,
      },
      '*',
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function interceptor(this: WebSocket, listener: (this: WebSocket, ev: MessageEvent) => any, ev: MessageEvent) {
    const url = window.location.href;
    const match = url.match(/.*context=(?<Context>[0-9a-fA-F]{32})/);

    let context: string | undefined;
    if (match && match.groups && Object.hasOwn(match.groups, 'Context')) {
      context = '"' + match.groups['Context'] + '"';
    } else {
      context = undefined;
    }

    sendWindowMessage({
      payload: ev.data,
      context,
    });

    listener.call(this, ev);
  }

  window.WebSocket = new Proxy(WebSocket, {
    construct(target: typeof WebSocket, args: [string, (string | string[])?]) {
      const ws = new target(...args);

      return new Proxy(ws, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        set(target: WebSocket, prop: string | symbol, value: any) {
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

  console.log('RPrUn: Injected WebSocket listener.');
})();
