import onetime from 'onetime';
import { onNodeTreeMutation } from '@src/utils/on-node-tree-mutation';

let elements: [Node, () => void][] = [];

export function onNodeDisconnected(node: Node, callback: () => void) {
  if (!node.isConnected) {
    callback();
    return;
  }

  setupObserver();
  elements.push([node, callback]);
}

const setupObserver = onetime(() => onNodeTreeMutation(document, checkConnected));

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

let elementsLazy: [Node, () => void][] = [];

// Cheaper alternative to onNodeDisconnected. Use when you don't need the callback to be called immediately.
export function onNodeDisconnectedLazy(node: Node, callback: () => void) {
  if (!node.isConnected) {
    callback();
    return;
  }

  setupObserverLazy();
  elementsLazy.push([node, callback]);
}

const setupObserverLazy = onetime(() => setInterval(checkConnectedLazy, 1000));

function checkConnectedLazy() {
  const currentElements = elementsLazy;
  elementsLazy = [];
  for (const element of currentElements) {
    if (element[0].isConnected) {
      elementsLazy.push(element);
      continue;
    }
    try {
      element[1]();
    } catch (e) {
      console.error(e);
    }
  }
}
