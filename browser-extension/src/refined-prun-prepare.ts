// This separate content script is required because it must be processed
// superfast, before the PrUn script gets the chance to load.
{
  const processHead = (observer: MutationObserver) => {
    const appScripts = document.head?.getElementsByTagName('script');
    if (appScripts?.length > 0) {
      // Serialize app scripts to prevent PrUn loading before client-side proxies
      // are injected. The scripts will be attached back to head in the client script.
      let foundBundle = false;
      for (let i = 0; i < appScripts.length; i++) {
        const appScript = appScripts[i];
        if (appScript.src.includes('apex.prosperousuniverse.com')) {
          foundBundle = true;
          appScript.textContent = appScript.src;
          appScript.src = '';
        }
      }
      if (foundBundle) {
        observer.disconnect();
      }
    }
  };
  const observer = new MutationObserver(() => processHead(observer));
  observer.observe(document, { childList: true, subtree: true });
  processHead(observer);
}
