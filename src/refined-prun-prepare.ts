// This separate content script is required because it must be processed
// superfast, before the PrUn script gets the chance to load.
function prepare() {
  if (document.documentElement.hasAttribute('refined-prun')) {
    return;
  }
  const observer = new MutationObserver(() => serializeScripts());
  observer.observe(document, { childList: true, subtree: true });
  const serializeScripts = () => {
    // Serialize app scripts to prevent PrUn loading before client-side proxies
    // are injected. The scripts will be attached back to head in the client script.
    for (const s of Array.from(document.head?.getElementsByTagName('script') ?? [])) {
      if (s.src.includes('apex.prosperousuniverse.com')) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const checkScript = (e: any) => {
          if (e.target.src === s.src) {
            e.preventDefault();
            window.removeEventListener('beforescriptexecute', checkScript);
          }
        };
        window.addEventListener('beforescriptexecute', checkScript);
        s.textContent = s.src;
        s.src = '';
        observer.disconnect();
      }
    }
  };
  serializeScripts();
}

prepare();
