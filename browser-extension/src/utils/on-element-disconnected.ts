import onetime from 'onetime';

let elements: [Element, () => void][] = [];

export function onElementDisconnected(element: Element, callback: () => void) {
  if (!element.isConnected) {
    callback();
    return;
  }

  onetime(setupObserver);
  elements.push([element, callback]);
}

function setupObserver() {
  const observer = new MutationObserver(checkConnected);
  observer.observe(document, { childList: true, subtree: true });
}

function checkConnected() {
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
      // Do nothing.
    }
  }
}
