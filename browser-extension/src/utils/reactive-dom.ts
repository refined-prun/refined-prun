import { ref } from 'vue';

export function refTextContent(element: Element) {
  const textContent = ref(element.textContent);
  const observer = new MutationObserver(() => (textContent.value = element.textContent));
  observer.observe(element, { childList: true, subtree: true, characterData: true });
  return textContent;
}

export function refAttributeValue(element: Element, name: string) {
  const value = ref(element.getAttribute(name));
  const observer = new MutationObserver(() => (value.value = element.getAttribute(name)));
  observer.observe(element, { attributes: true });
  return value;
}
