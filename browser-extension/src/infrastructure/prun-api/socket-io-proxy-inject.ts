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
    // Serialize app script an remove it from DOM to prevent PrUn loading
    // before socket.io proxy is injected. This script will be attached
    // back to head in proxy script.
    const appScript = head.getElementsByTagName('script')[0];
    appScript.remove();
    const proxyScript = document.createElement('script');
    proxyScript.src = (__CHROME__ ? chrome : browser).runtime.getURL('socket-io-proxy.js');
    proxyScript.textContent = appScript.src;
    head.appendChild(proxyScript);
    return true;
  }
})();
