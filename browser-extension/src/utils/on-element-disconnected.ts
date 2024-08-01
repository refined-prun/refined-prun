import onetime from 'onetime';
import observeDocumentMutations from '@src/utils/document-mutation-observer';

let elements: [Element, () => void][] = [];

export default function onElementDisconnected(element: Element, callback: () => void) {
  if (!element.isConnected) {
    callback();
    return;
  }

  setupObserver();
  elements.push([element, callback]);
}

const setupObserver = onetime(() => {
  observeDocumentMutations(checkConnected);
});

function checkConnected(mutations: MutationRecord[]) {
  if (mutations.every(x => x.removedNodes.length === 0)) {
    return;
  }
  const currentElements = elements;
  elements = [];
  for (const element of currentElements) {
    if (element[0].isConnected) {
      elements.push(element);
      continue;
    }
    try {
      element[1]();
    } catch (e) {
      console.error(e);
    }
  }
}
