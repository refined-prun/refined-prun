function startPageFunctionBridge() {
  window.addEventListener('message', (event: MessageEvent) => {
    if (event.source !== window) {
      return;
    }
    if (event.data.type === 'rp-reload-page') {
      window.location.reload();
    }
  });
}

try {
  startPageFunctionBridge();
} catch (error) {
  console.error(error);
}
