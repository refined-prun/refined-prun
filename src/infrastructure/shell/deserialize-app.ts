import { isValidUrl } from '@src/utils/is-valid-url';

// App script deserialization is extracted to a separate file in a top-level code block
// to ensure that APEX can launch even if some script in rprun fails to load.
const scripts = document.head.getElementsByTagName('script');
for (let i = 0; i < scripts.length; i++) {
  const script = scripts[i];
  if (script.textContent && isValidUrl(script.textContent)) {
    const clone = document.createElement('script');
    clone.src = script.textContent;
    clone.defer = script.defer;
    clone.async = script.async;
    clone.type = script.type;
    document.head.appendChild(clone);
    script.remove();
  }
}
