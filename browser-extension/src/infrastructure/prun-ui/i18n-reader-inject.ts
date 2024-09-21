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
    const script = document.createElement('script');
    script.src = (__CHROME__ ? chrome : browser).runtime.getURL('i18n-reader.js');
    document.head.appendChild(script);
    return true;
  }
})();
