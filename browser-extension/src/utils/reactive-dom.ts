import { ref } from 'vue';

export function refTextContent(element: Element) {
  const textContent = ref(element.textContent);
  const observer = new MutationObserver(() => (textContent.value = element.textContent));
  observer.observe(element, { childList: true, subtree: true, characterData: true });
  return textContent;
}
