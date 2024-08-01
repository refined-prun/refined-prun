type MutationCallback = (mutations: MutationRecord[]) => boolean | void;

let callbacks: MutationCallback[] = [];
const observer = new MutationObserver(runCallbacks);

export default function observeDocumentMutations(callback: MutationCallback) {
  if (callbacks.length === 0) {
    observer.observe(document, { childList: true, subtree: true });
  }
  callbacks.push(callback);
}

function runCallbacks(mutations: MutationRecord[]) {
  let removed: MutationCallback[] | undefined;
  for (const callback of callbacks) {
    try {
      if (callback(mutations)) {
        removed ??= [];
        removed.push(callback);
      }
    } catch (e) {
      console.error(e);
    }
  }
  if (removed) {
    callbacks = callbacks.filter(x => !removed?.includes(x));
    if (callbacks.length === 0) {
      observer.disconnect();
    }
  }
}
