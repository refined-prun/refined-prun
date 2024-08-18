import { Ref, ref } from 'vue';

export function refTextContent(element: Element) {
  const textContent = ref(element.textContent);
  const observer = new MutationObserver(() => (textContent.value = element.textContent));
  observer.observe(element, { childList: true, subtree: true, characterData: true });
  return textContent;
}

export function refValue(element: Element & { value: string }) {
  return refAnimationFrame(element, x => x.value);
}

export function refAttributeValue(element: Element, name: string) {
  const value = ref(element.getAttribute(name));
  const observer = new MutationObserver(() => (value.value = element.getAttribute(name)));
  observer.observe(element, { attributes: true });
  return value;
}

export function refAnimationFrame<T extends Element, K>(element: T, getter: (x: T) => K) {
  const value = ref(getter(element));
  const update = () => {
    if (element.isConnected) {
      requestAnimationFrame(update);
    }
    (value as Ref<K>).value = getter(element);
  };

  requestAnimationFrame(update);
  return value;
}
