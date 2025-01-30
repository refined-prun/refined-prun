import { fetchJson } from '@src/utils/fetch';

export function trackExtensionUpdate() {
  const container = document.getElementById('container')!;
  const id = setInterval(async () => {
    const manifest = (await fetchJson(config.url.manifest)) as chrome.runtime.ManifestV3;
    if (!manifest.version || config.version === manifest.version) {
      return;
    }
    createFragmentApp(() => (
      <div class={[C.Connecting.processing, C.Connecting.overlay]} style={{ zIndex: '999999' }}>
        <span class={[C.Connecting.message, C.fonts.fontRegular, C.type.typeLarger]}>
          Reloading Refined PrUn...
        </span>
      </div>
    )).appendTo(container);
    void setTimeout(() => window.location.reload(), 2000);
    clearInterval(id);
  }, 1000);
}
