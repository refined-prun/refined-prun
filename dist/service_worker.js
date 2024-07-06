// Chrome-MV3 service worker
importScripts(["./default_event_payload.js"]);
importScripts(["./uploader.js"]);

if (typeof browser === "undefined") {
  var browser = chrome;
}

//browser.action.enable();

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // for some reason, even though it's specified in hosts_permission,
  // mv3 still tries to run this on EVERY page.
  if (changeInfo.status === 'complete' && /^https?:\/\/apex.prosperousuniverse.com/.test(tab.url)) {
    browser.scripting
      .executeScript({
        target: {tabId: tabId},
        files: ["foreground.js"]
      })
      .then(() => {
        console.log("Injected the foreground script.");
      });
  }
});

browser.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.message === "pmmg_websocket_update") {
    //console.debug("Listener: websocket_update");
    //console.debug(request);
    ProcessMessage({data: request.payload});
    return false; // no async response
  }
});
