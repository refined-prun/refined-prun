import { ProcessMessage } from '@lib/background/uploader';

if (__CHROME__) {
  // Chrome-MV3 service worker
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // for some reason, even though it's specified in hosts_permission,
    // mv3 still tries to run this on EVERY page.
    if (changeInfo.status === 'complete' && /^https?:\/\/apex.prosperousuniverse.com/.test(tab.url!)) {
      chrome.scripting
        .executeScript({
          target: { tabId: tabId },
          files: ['foreground.js'],
        })
        .then(() => {
          console.log('Injected the foreground script.');
        });
    }
  });

  chrome.runtime.onMessage.addListener(async function (request) {
    if (request.message === 'pmmg_websocket_update') {
      //console.debug("Listener: websocket_update");
      //console.debug(request);
      ProcessMessage({ data: request.payload });
      return false; // no async response
    }
    return undefined;
  });
} else {
  // Firefox background code...
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // for some reason, even though it's specified in hosts_permission,
    // mv3 still tries to run this on EVERY page.
    if (changeInfo.status === 'complete' && /apex.prosperousuniverse.com/.test(tab.url!)) {
      browser.scripting
        .executeScript({
          target: { tabId: tabId },
          files: ['./foreground.js'],
        })
        .then(() => {
          console.log('Injected the foreground script.');
        });
    }
  });

  browser.runtime.onMessage.addListener(async function (request) {
    if (request.message === 'pmmg_websocket_update') {
      //console.debug("Listener: websocket_update");
      //console.debug(request);
      ProcessMessage({ data: request.payload });
      return false; // no async response
    }
    return undefined;
  });

  // Handle HTML5 PushState--this is like a half-refresh
  const HandleOnHistoryStateUpdated = details => {
    //console.log("PMMG: Detected PushState");
    //console.log(`\tURL: ${details.url}`);
    //console.log(`\tTransitionType: ${details.transitionType}`);
    //console.log(`\tTransitionQualifiers: ${details.transitionQualifiers}`);
    if (details.url.toLowerCase().includes('https://apex.prosperousuniverse.com')) {
      // @ts-expect-error tabId is optional, wtf is it mandatory in typings
      browser.tabs.executeScript(null, { file: 'contentscript.js' }, () => {
        console.log('PMMG: Executing contentscript.js');
        const e = browser.runtime.lastError;
        if (e !== undefined && e !== null) {
          console.log('PMMG: ExecuteScriptFailure: ' + e);
        }
      });
    }
  };

  console.log('PMMG: Checking for existing listener');
  if (browser.webNavigation.onHistoryStateUpdated.hasListener(HandleOnHistoryStateUpdated)) {
    console.log('PMMG: Unregistering existing HistoryState listener');
    browser.webNavigation.onHistoryStateUpdated.removeListener(HandleOnHistoryStateUpdated);
  }

  console.log('PMMG: Adding listener');
  browser.webNavigation.onHistoryStateUpdated.addListener(HandleOnHistoryStateUpdated);
}
