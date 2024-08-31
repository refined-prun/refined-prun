// This separate content script is required because it must be processed
// superfast, before the PrUn script gets loaded.
const script = document.createElement('script');
script.src = (__CHROME__ ? chrome : browser).runtime.getURL('socket-io-proxy.js');
script.onload = () => script.remove();
(document.head || document.documentElement).appendChild(script);
