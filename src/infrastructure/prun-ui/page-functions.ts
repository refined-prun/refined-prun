export async function checkPmmgPresent() {
  return await new Promise<boolean>(resolve => {
    const listener = (event: MessageEvent) => {
      if (event.source !== window) {
        return;
      }
      if (event.data.type === 'rp-pmmg-present') {
        resolve(true);
        window.removeEventListener('message', listener);
      }
      if (event.data.type === 'rp-pmmg-not-present') {
        resolve(false);
        window.removeEventListener('message', listener);
      }
    };
    window.addEventListener('message', listener);
    window.postMessage({ type: 'rp-check-pmmg' }, '*');
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function alert(message: any) {
  return await new Promise<void>(resolve => {
    const listener = (event: MessageEvent) => {
      if (event.source !== window) {
        return;
      }
      if (event.data.type === 'rp-alert-result') {
        resolve();
        window.removeEventListener('message', listener);
      }
    };
    window.addEventListener('message', listener);
    window.postMessage({ type: 'rp-alert', message }, '*');
  });
}

export function reloadPage() {
  window.postMessage({ type: 'rp-reload-page' }, '*');
}
