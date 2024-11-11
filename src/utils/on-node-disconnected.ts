import onetime from 'onetime';
import observeDocumentMutations from '@src/utils/document-mutation-observer';

let elements: [Node, () => void][] = [];

export default function onNodeDisconnected(node: Node, callback: () => void) {
  if (!node.isConnected) {
    callback();
    return;
  }

  setupObserver();
  elements.push([node, callback]);
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
