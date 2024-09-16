// This separate content script is required because it must be processed
// superfast, before the PrUn script gets loaded.
(() => {
  if (!processHead()) {
    const observer = new MutationObserver(() => {
      if (processHead()) {
        observer?.disconnect();
      }
    });
    observer.observe(document, { childList: true, subtree: true });
  }
  function processHead() {
    const head = document.head;
    if (!head) {
      return false;
    }
    const proxyScript = document.createElement('script');
    // Serialize app script an remove it from DOM to prevent PrUn loading
    // before socket.io proxy is injected. This script will be attached
    // back to head in proxy script.
    const appScript = head.getElementsByTagName('script')[0];
    proxyScript.textContent = btoa(appScript.src);
    appScript.remove();
    proxyScript.src = (__CHROME__ ? chrome : browser).runtime.getURL('socket-io-proxy.js');
    head.appendChild(proxyScript);
    return true;
  }
})();
