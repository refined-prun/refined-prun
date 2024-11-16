function startPageFunctionBridge() {
  window.addEventListener('message', async (event: MessageEvent) => {
    if (event.source !== window) {
      return;
    }
    if (event.data.type === 'rp-reload-page') {
      window.location.reload();
    }
    if (event.data.type === 'rp-check-pmmg') {
      window.postMessage(
        { type: window['PMMG_COLLECTOR_HAS_RUN'] ? 'rp-pmmg-present' : 'rp-pmmg-not-present' },
        '*',
      );
    }
  });
}

try {
  startPageFunctionBridge();
} catch (error) {
  console.error(error);
}
