import oneMutation from 'one-mutation';

export async function* streamHtmlCollection<T extends Element>(
  root: Element | Document,
  elements: HTMLCollectionOf<T>,
) {
  const seenElements = new WeakSet<T>();

  // Enumerate elements via Array.from to prevent
  // bugs when the HTMLCollection is modified during yield.
  for (const element of Array.from(elements)) {
    seenElements.add(element);
    yield element;
  }

  while (true) {
    const newElements = new Set<T>();
    await oneMutation(root, {
      childList: true,
      subtree: true,
      filter: () => {
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          if (!seenElements.has(element)) {
            newElements.add(element);
          }
        }
        return newElements.size > 0;
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
