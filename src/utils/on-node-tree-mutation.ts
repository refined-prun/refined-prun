type MutationCallback = (mutations: MutationRecord[]) => boolean | void;

const callbackMap = new WeakMap<Node, MutationCallback[]>();
const removed = new Set<MutationCallback>();

export function onNodeTreeMutation(node: Node, callback: MutationCallback) {
  let callbacks = callbackMap.get(node) ?? [];
  if (callbacks.length === 0) {
    callbackMap.set(node, callbacks);
    const observer = new MutationObserver(mutations => {
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
    });
    observer.observe(node, { childList: true, subtree: true });
  }
  callbacks.push(callback);
}
