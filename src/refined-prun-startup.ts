async function startup() {
  if (document.documentElement.hasAttribute('refined-prun')) {
    return;
  }
  const config: RefinedPrunConfig = {
    userData: await loadUserData(),
    version: chrome.runtime.getManifest().version,
    url: {
      manifest: chrome.runtime.getURL('manifest.json'),
      allplanets: chrome.runtime.getURL('json/fallback-fio-responses/allplanets.json'),
    },
  };
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('refined-prun.js');
  script.type = 'module';
  script.id = 'refined-prun';
  script.textContent = JSON.stringify(config);
  const css = document.createElement('link');
  css.href = chrome.runtime.getURL('refined-prun.css') + '?' + Date.now();
  css.id = 'refined-prun-css';
  css.rel = 'stylesheet';
  css.onload = () => {
    // This serialization is needed because accessing css.sheet in Firefox from the page script
    // will throw a CORS error.
    const rules: { [id: string]: string } = {};
    const sheet = css.sheet!;
    for (let i = 0; i < sheet.cssRules.length; i++) {
      const rule = sheet.cssRules.item(i) as CSSStyleRule;
      if (!rule) {
        continue;
      }
      rules[rule.selectorText] = rule.cssText;
    }
    css.textContent = JSON.stringify(rules);
  };
  await waitDocumentReady();
  document.head.appendChild(script);
  document.documentElement.appendChild(css);
}

async function loadUserData() {
  const userDataKey = 'rp-user-data';
  window.addEventListener('message', async (e: MessageEvent) => {
    if (e.source !== window) {
      return;
    }
    if (e.data.type === 'rp-save-user-data') {
      await chrome.storage.local.set({
        [userDataKey]: e.data.userData,
      });
      window.postMessage({ type: 'rp-user-data-saved' }, '*');
    }
  });
  const userData = await chrome.storage.local.get(userDataKey);
  return userData[userDataKey];
}

async function waitDocumentReady() {
  while (!document.head || !document.body) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

void startup();
