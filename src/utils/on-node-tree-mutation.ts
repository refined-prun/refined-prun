import { oneMicrotask } from '@src/utils/one-microtask';

type MutationCallback = (mutations: MutationRecord[]) => boolean | void;

const callbackMap = new WeakMap<Node, MutationCallback[]>();
const removed = new Set<MutationCallback>();

const pendingProcessors = new Set<() => void>();

const flush = oneMicrotask(() => {
  const processors = Array.from(pendingProcessors);
  pendingProcessors.clear();
  for (const process of processors) {
    process();
  }
});

export function onNodeTreeMutation(
  node: Node,
  callback: MutationCallback,
  observeClass: boolean = false,
) {
  let callbacks = callbackMap.get(node) ?? [];
  if (callbacks.length === 0) {
    callbackMap.set(node, callbacks);
    let pending: MutationRecord[] = [];
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        pending.push(mutation);
      }
      pendingProcessors.add(process);
      flush();
    });
    const process = () => {
      const mutations = pending;
      pending = [];
      for (const callback of callbacks) {
        try {
          if (callback(mutations)) {
            removed.add(callback);
          }
        } catch (e) {
          console.error(e);
          removed.add(callback);
        }
      }
      if (removed.size > 0) {
        const next = callbacks.filter(x => !removed.has(x));
        if (next.length === 0) {
          callbackMap.delete(node);
          observer.disconnect();
        } else {
          callbacks = next;
          callbackMap.set(node, callbacks);
        }
      }
      removed.clear();
    };
    const options: MutationObserverInit = {
      childList: true,
      subtree: true,
    };
    if (observeClass) {
      options.attributeFilter = ['class'];
    }
    observer.observe(node, options);
  }
  callbacks.push(callback);
}
