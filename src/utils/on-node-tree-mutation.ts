import { oneMicrotask } from '@src/utils/one-microtask';

type MutationCallback = (mutations: MutationRecord[]) => boolean | void;

interface Subscription {
  callback: MutationCallback;
  stop: () => void;
}

const observers = new WeakMap<
  Node,
  { observer: MutationObserver; subscriptions: Set<Subscription> }
>();

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
  let state = observers.get(node);
  if (state === undefined) {
    const subscriptions = new Set<Subscription>();
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
      for (const subscription of Array.from(subscriptions)) {
        if (!subscriptions.has(subscription)) {
          continue;
        }
        try {
          if (subscription.callback(mutations)) {
            subscription.stop();
          }
        } catch (e) {
          console.error(e);
          subscription.stop();
        }
      }
    };
    const options: MutationObserverInit = {
      childList: true,
      subtree: true,
    };
    if (observeClass) {
      options.attributeFilter = ['class'];
    }
    state = { observer, subscriptions };
    observers.set(node, state);
    observer.observe(node, options);
  }
  const { observer, subscriptions } = state;
  const subscription: Subscription = {
    callback,
    stop: () => {
      if (!subscriptions.delete(subscription)) {
        return;
      }
      if (subscriptions.size === 0) {
        observers.delete(node);
        observer.disconnect();
      }
    },
  };
  subscriptions.add(subscription);
  return subscription.stop;
}
