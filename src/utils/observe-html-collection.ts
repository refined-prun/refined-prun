import { onNodeTreeMutation } from '@src/utils/on-node-tree-mutation';
import { Observable } from '@src/utils/observable';

export function observeHtmlCollection<T extends Element>(
  root: Node,
  elements: HTMLCollectionOf<T>,
): Observable<T> {
  return {
    subscribe(onNext) {
      const seen = new WeakSet<T>();
      const next = (element: T) => {
        seen.add(element);
        try {
          onNext(element);
        } catch (e) {
          console.error(e);
        }
      };

      for (const element of Array.from(elements)) {
        next(element);
      }

      onNodeTreeMutation(
        root,
        mutations => {
          if (mutations.every(x => x.addedNodes.length === 0)) {
            return;
          }
          for (const element of Array.from(elements)) {
            if (!seen.has(element)) {
              next(element);
            }
          }
        },
        true,
      );
    },
  };
}

export async function waitElementOfHtmlCollection<T extends Element>(
  root: Node,
  elements: HTMLCollectionOf<T>,
) {
  if (elements.length > 0) {
    return elements[0] as T;
  }

  await new Promise<void>(resolve => {
    onNodeTreeMutation(
      root,
      () => {
        if (elements.length > 0) {
          resolve();
          return true;
        }
        return false;
      },
      true,
    );
  });

  return elements[0] as T;
}
