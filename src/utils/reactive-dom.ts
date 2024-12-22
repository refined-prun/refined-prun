export function refTextContent(element: Node) {
  const textContent = ref(element.textContent);
  const observer = new MutationObserver(() => (textContent.value = element.textContent));
  observer.observe(element, { childList: true, subtree: true, characterData: true });
  return textContent;
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

let animationFrameUpdates: (() => boolean)[] = [];

export function refAnimationFrame<T extends Node, K>(element: T, getter: (x: T) => K) {
  const value = ref(getter(element));
  animationFrameUpdates.push(() => {
    if (element.isConnected) {
      (value as Ref<K>).value = getter(element);
      return true;
    }
    return false;
  });
  if (animationFrameUpdates.length === 1) {
    runAnimationFrameUpdates();
  }
  return value;
}

function runAnimationFrameUpdates() {
  const next: typeof animationFrameUpdates = [];
  for (const update of animationFrameUpdates) {
    if (update()) {
      next.push(update);
    }
  }
  animationFrameUpdates = next;
  if (animationFrameUpdates.length > 0) {
    requestAnimationFrame(runAnimationFrameUpdates);
  }
}

runAnimationFrameUpdates();
