import '@src/infrastructure/prun-api/socket-io-proxy';
import '@src/infrastructure/prun-ui/i18n-reader';

// Deserialize app scripts.
const scripts = document.head.getElementsByTagName('script');
for (let i = 0; i < scripts.length; i++) {
  const script = scripts[i];
  if (script.textContent) {
    const clone = document.createElement('script');
    clone.src = script.textContent;
    clone.defer = script.defer;
    clone.async = script.async;
    clone.type = script.type;
    document.head.appendChild(clone);
    script.remove();
  }
}
