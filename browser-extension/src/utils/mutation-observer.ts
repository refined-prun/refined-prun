import observeDocumentMutations from '@src/utils/document-mutation-observer';
import type { ParseSelector } from 'typed-query-selector/parser';

type ObserverListener<ExpectedElement extends Element> = (element: ExpectedElement) => void;

interface ObserveOptions<ExpectedElement extends Element> {
  callback: ObserverListener<ExpectedElement>;
  baseElement: Element | Document;
}

export function observeReadyElementsByClassName<
  Selector extends string,
  Selected extends Element = ParseSelector<Selector, HTMLElement>,
>(classNames: Selector, callbackOrOptions: ObserverListener<Selected> | ObserveOptions<Selected>) {
  const { baseElement, callback } = getObserverOptions(callbackOrOptions);
  const elements = baseElement.getElementsByClassName(classNames) as HTMLCollectionOf<Selected>;
  observeHtmlCollectionChanged(baseElement, elements, callback);
}

export function observeReadyElementsByTagName<
  Selector extends string,
  Selected extends Element = ParseSelector<Selector, HTMLElement>,
>(tagName: Selector, callbackOrOptions: ObserverListener<Selected> | ObserveOptions<Selected>) {
  const { baseElement, callback } = getObserverOptions(callbackOrOptions);
  const elements = baseElement.getElementsByTagName(tagName) as HTMLCollectionOf<Selected>;
  observeHtmlCollectionChanged(baseElement, elements, callback);
}

function getObserverOptions<T extends Element>(
  callbackOrOptions: ObserverListener<T> | ObserveOptions<T>,
) {
  if (typeof callbackOrOptions === 'function') {
    return {
      callback: callbackOrOptions,
      baseElement: document,
    } as ObserveOptions<T>;
  }

  return callbackOrOptions;
}

export function observeHtmlCollectionChanged<T extends Element>(
  baseElement: Element | Document,
  elements: HTMLCollectionOf<T>,
  callback: ObserverListener<T>,
) {
  const seenElements = new WeakSet<T>();
  const checkElements = () => {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (!seenElements.has(element)) {
        seenElements.add(element);
        try {
          callback(element);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return false;
  };
  if (baseElement === document) {
    observeDocumentMutations(checkElements);
  } else {
    observeDescendantListChanged(baseElement, checkElements);
  }
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
