import { isEmpty } from 'ts-extras';

type MutationCallback = (mutations: MutationRecord[]) => boolean | void;

let callbacks: MutationCallback[] = [];
const observer = new MutationObserver(runCallbacks);

export default function observeDocumentMutations(callback: MutationCallback) {
  if (isEmpty(callbacks)) {
    observer.observe(document, { childList: true, subtree: true });
  }
  callbacks.push(callback);
}

function runCallbacks(mutations: MutationRecord[]) {
  let removed: MutationCallback[] | undefined = undefined;
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
    if (isEmpty(callbacks)) {
      observer.disconnect();
    }
  }
}
