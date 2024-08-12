import observeDocumentMutations from '@src/utils/document-mutation-observer';

type ObserverListener<ExpectedElement extends Element> = (
  element: ExpectedElement,
  options: SignalAsOptions,
) => void;

export default function observeReadyElementsByClassName<ExpectedElement extends Element>(
  classNames: string,
  callback: ObserverListener<ExpectedElement>,
  { signal }: SignalAsOptions = {},
) {
  if (signal?.aborted) {
    return;
  }

  const elements = document.getElementsByClassName(classNames) as HTMLCollectionOf<ExpectedElement>;
  const seenElements = new WeakSet<ExpectedElement>();
  observeDocumentMutations(() => {
    if (signal?.aborted) {
      return true;
    }

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (!seenElements.has(element)) {
        seenElements.add(element);
        try {
          callback(element, { signal });
        } catch (e) {
          console.error(e);
        }
        if (signal?.aborted) {
          return true;
        }
      }
    }
    return false;
  });
}

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

export function observeDescendantListChanged<T extends Node>(
  target: T,
  callback: (target: T) => void,
) {
  callback(target);
  const observer = new MutationObserver(() => callback(target));
  observer.observe(target, { childList: true, subtree: true });
}

export function observeCharacterDataChanged(target: Node, callback: () => void) {
  callback();
  const observer = new MutationObserver(callback);
  observer.observe(target, { characterData: true });
}
