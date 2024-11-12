export function refTextContent(element: Node) {
  const textContent = ref(element.textContent);
  const observer = new MutationObserver(() => (textContent.value = element.textContent));
  observer.observe(element, { childList: true, subtree: true, characterData: true });
  return textContent;
}

export function refInnerText(element: HTMLElement) {
  const innerText = ref(element.innerText);
  const observer = new MutationObserver(() => (innerText.value = element.innerText));
  observer.observe(element, { childList: true, subtree: true, characterData: true });
  return innerText;
}

export function refValue<T extends string | number>(element: Node & { value: T }) {
  return refAnimationFrame(element, x => x.value);
}

export function refAttributeValue(element: Element, name: string) {
  const value = ref(element.getAttribute(name));
  const observer = new MutationObserver(() => (value.value = element.getAttribute(name)));
  observer.observe(element, { attributes: true });
  return value;
}

export function refAnimationFrame<T extends Node, K>(element: T, getter: (x: T) => K) {
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
