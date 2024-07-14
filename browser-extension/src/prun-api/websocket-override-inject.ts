// This separate content script is required because it must be processed
// superfast, before the PrUn script gets loaded.
const script = document.createElement('script');
script.src = (chrome ?? browser).runtime.getURL('websocket-override.js');
script.onload = () => script.remove();
(document.head || document.documentElement).appendChild(script);
