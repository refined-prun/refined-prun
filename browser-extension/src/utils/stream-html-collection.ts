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

// Copy of one-mutation made work with Node objects

type Options = {
  filter?: (mutations: MutationRecord[]) => boolean;
  signal?: AbortSignal;
} & MutationObserverInit;

async function oneMutation(
  node: Node,
  { filter, signal, ...options }: Options = {},
): Promise<MutationRecord[]> {
  if (signal?.aborted) {
    return [];
  }

  return new Promise(resolve => {
    const observer = new MutationObserver(changes => {
      if (!filter || filter(changes)) {
        observer.disconnect();
        resolve(changes);
      }
    });
    observer.observe(node, options);

    signal?.addEventListener('abort', () => {
      observer.disconnect();
      resolve([]);
    });
  });
}
