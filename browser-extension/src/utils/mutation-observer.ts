export function observeChildren(target: Element, callback: (node: Node) => void) {
  Array.from(target.children).forEach(callback);
  observeChildAdded(target, callback);
}

export function observeChildAdded(target: Node, callback: (node: Node) => void) {
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(callback);
    }
  });
  observer.observe(target, { childList: true });
}

export function observeChildListChanged<T extends Node>(target: T, callback: (target: T) => void) {
  callback(target);
  const observer = new MutationObserver(() => callback(target));
  observer.observe(target, { childList: true });
}

export function observeDescendantListChanged<T extends Node>(target: T, callback: (target: T) => void) {
  callback(target);
  const observer = new MutationObserver(() => callback(target));
  observer.observe(target, { childList: true, subtree: true });
}

export function observeCharacterDataChanged(target: Node, callback: () => void) {
  callback();
  const observer = new MutationObserver(callback);
  observer.observe(target, { characterData: true });
}
