import oneMutation from 'one-mutation';

export async function* streamHtmlCollection<T extends Element>(
  root: Element | Document,
  elements: HTMLCollectionOf<T>,
) {
  const seenElements = new WeakSet<T>();

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    seenElements.add(element);
    yield element;
  }

  while (true) {
    const newElements: T[] = [];
    await oneMutation(root, {
      childList: true,
      subtree: true,
      filter: () => {
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          if (!seenElements.has(element)) {
            newElements.push(element);
          }
        }
        return newElements.length > 0;
      },
    });

    for (const element of newElements) {
      seenElements.add(element);
      yield element;
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

  await oneMutation(root, {
    childList: true,
    subtree: true,
    filter: () => elements.length > 0,
  });

  return elements[0] as T;
}
