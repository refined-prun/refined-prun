// Listen for window.postMessage events from the webpage,
// pass them on to the extension's service worker.
// This can't go direct from webpage to service worker, hence
// the addition of this intermediary.
if (typeof browser === 'undefined') {
  var browser = chrome;
}

var func;
if (typeof listen === 'undefined') {
  function listen(event) {
    if (event.source != window) return;

    if (typeof browser === 'undefined') {
      var browser = chrome;
    }
    if (event.data.message && event.data.message === 'pmmg_websocket_update') {
      browser.runtime.sendMessage({
        message: 'pmmg_websocket_update',
        payload: event.data.payload,
      });
    }
    if (event.data.message && event.data.message === 'prep_registration') {
      browser.runtime.sendMessage(event.data);
    }
  }

  func = listen;
} else {
  func = listen;
}

window.removeEventListener('message', func);
window.addEventListener('message', func);
