export function reloadPage() {
  window.postMessage({ type: 'rp-reload-page' });
}
