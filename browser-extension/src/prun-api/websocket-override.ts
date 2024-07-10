(function () {
  if (window['RPU_COLLECTOR_HAS_RUN'] === true) {
    console.debug('Already injected websocket rebinding');
    return;
  }

  window['RPU_COLLECTOR_HAS_RUN'] = true;
  const NativeWebSocket = window.WebSocket;
  const callWebSocket = NativeWebSocket.apply.bind(NativeWebSocket);
  let wsAddListener = NativeWebSocket.prototype.addEventListener;
  wsAddListener = wsAddListener.call.bind(wsAddListener);
  // @ts-expect-error It just works
  window.WebSocket = function WebSocket(this: unknown, url: string | URL, protocols: string | string[] | undefined) {
    let ws: WebSocket;
    if (!(this instanceof WebSocket)) {
      // Called without 'new' (browsers will throw an error).
      // @ts-expect-error This is expected
      // eslint-disable-next-line prefer-rest-params
      ws = callWebSocket(this, arguments);
    } else if (arguments.length === 0) {
      // No arguments (browsers will throw an error)
      // @ts-expect-error This is expected
      ws = new NativeWebSocket();
    } else if (arguments.length === 1) {
      ws = new NativeWebSocket(url);
    } else {
      ws = new NativeWebSocket(url, protocols);
    }

    // @ts-expect-error It just works
    wsAddListener(ws, 'message', function (event: MessageEvent) {
      //console.debug("Websocket message occurred");
      const url = window.location.href;
      const match = url.match(/.*context=(?<Context>[0-9a-fA-F]{32})/);

      let context: string | undefined;
      if (match && match.groups && Object.hasOwn(match.groups, 'Context')) {
        context = '"' + match.groups['Context'] + '"';
      } else {
        context = undefined;
      }

      window.postMessage(
        {
          message: 'rpu-websocket-message',
          payload: event.data,
          context,
        },
        '*',
      );
    });
    return ws;
    // @ts-expect-error It just works
  }.bind();

  window.WebSocket.prototype = NativeWebSocket.prototype;
  window.WebSocket.prototype.constructor = window.WebSocket;
  console.log('RPrUn: Injected WebSocket listener.');
})();
