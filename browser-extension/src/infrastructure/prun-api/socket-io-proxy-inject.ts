// This separate content script is required because it must be processed
// superfast, before the PrUn script gets loaded.
(() => {
  const observer = new MutationObserver(() => {
    if (document.head) {
      const script = document.createElement('script');
      script.src = (__CHROME__ ? chrome : browser).runtime.getURL('socket-io-proxy.js');
      document.head.insertBefore(script, document.head.firstChild);
      observer.disconnect();
    }
  });
  observer.observe(document, { childList: true, subtree: true });
})();
