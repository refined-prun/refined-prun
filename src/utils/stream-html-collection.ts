import { isEmpty } from 'ts-extras';
import { onNodeTreeMutation } from '@src/utils/on-node-tree-mutation';

export async function* streamHtmlCollection<T extends Element>(
  root: Node,
  elements: HTMLCollectionOf<T>,
) {
  const seenElements = new WeakSet<T>();

  // Enumerate elements via Array.from to prevent
  // bugs when the HTMLCollection is modified during yield.
  for (const element of Array.from(elements)) {
    seenElements.add(element);
    yield element;
  }

  const newElements: T[] = [];
  let resolve = () => {};
  onNodeTreeMutation(root, mutations => {
    if (mutations.every(x => x.addedNodes.length === 0)) {
      return;
    }
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (!seenElements.has(element)) {
        seenElements.add(element);
        newElements.push(element);
      }
    }

    if (!isEmpty(newElements)) {
      resolve();
    }
  });
  while (true) {
    await new Promise<void>(x => (resolve = x));
    while (!isEmpty(newElements)) {
      yield newElements.shift()!;
    }
  }
}

export async function streamElementOfHtmlCollection<T extends Element>(
  root: Node,
  elements: HTMLCollectionOf<T>,
) {
  if (elements.length > 0) {
    return elements[0] as T;
  }

  await new Promise<void>(resolve => {
    onNodeTreeMutation(root, () => {
      if (elements.length > 0) {
        resolve();
        return true;
      }
      return false;
    });
  });

  return elements[0] as T;
}
