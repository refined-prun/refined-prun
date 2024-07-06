// Firefox background code...
function AddScriptToDOM(script_name) {
  var s = document.createElement('script');
  s.src = browser.runtime.getURL(script_name);
  s.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);
}

AddScriptToDOM("./default_event_payload.js");
AddScriptToDOM("./uploader.js");

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // for some reason, even though it's specified in hosts_permission,
  // mv3 still tries to run this on EVERY page.
  if (changeInfo.status === 'complete' && /apex.prosperousuniverse.com/.test(tab.url)) {
    browser.scripting
      .executeScript({
        target: {tabId: tabId},
        files: ["./foreground.js"]
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


// Handle HTML5 PushState--this is like a half-refresh
function HandleOnHistoryStateUpdated(details) {
  //console.log("PMMG: Detected PushState");
  //console.log(`\tURL: ${details.url}`);
  //console.log(`\tTransitionType: ${details.transitionType}`);
  //console.log(`\tTransitionQualifiers: ${details.transitionQualifiers}`);
  if (details.url.toLowerCase().includes("https://apex.prosperousuniverse.com")) {
    browser.tabs.executeScript(null, {file: "contentscript.js"},
      _ => {
        console.log("PMMG: Executing contentscript.js");
        let e = browser.runtime.lastError;
        if (e !== undefined && e !== null) {
          console.log("PMMG: ExecuteScriptFailure: " + e);
        }
      });
  }
}

console.log("PMMG: Checking for existing listener");
if (browser.webNavigation.onHistoryStateUpdated.hasListener(HandleOnHistoryStateUpdated)) {
  console.log("PMMG: Unregistering existing HistoryState listener");
  browser.webNavigation.onHistoryStateUpdated.removeListener(HandleOnHistoryStateUpdated);
}

console.log("PMMG: Adding listener");
browser.webNavigation.onHistoryStateUpdated.addListener(HandleOnHistoryStateUpdated);
