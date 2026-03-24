import { fetchJson } from '@src/utils/fetch';

if (import.meta.env.PROD) {
  const container = document.getElementById('container')!;
  const id = setInterval(async () => {
    const manifest = (await fetchJson(config.url.manifest)) as chrome.runtime.ManifestV3;
    if (!manifest.version || config.version === manifest.version) {
      return;
    }
    void setTimeout(() => window.location.reload(), 3000);
    clearInterval(id);
    if (C.Connecting === undefined) {
      // There might be a case where PrUn CSS was not parsed yet.
      return;
    }
    createFragmentApp(() => (
      <div class={[C.Connecting.processing, C.Connecting.overlay]} style={{ zIndex: '999999' }}>
        <span class={[C.Connecting.message, C.fonts.fontRegular, C.type.typeLarger]}>
          Reloading Refined PrUn...
        </span>
      </div>
    )).appendTo(container);
  }, 1000);
}
