import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { onNodeTreeMutation } from '@src/utils/on-node-tree-mutation';

const observers = new Map<Node, FakeObserver>();

class FakeObserver {
  connected = false;
  options?: MutationObserverInit;

  constructor(readonly callback: (mutations: MutationRecord[]) => void) {}

  observe(node: Node, options: MutationObserverInit) {
    observers.set(node, this);
    this.options = options;
    this.connected = true;
  }

  disconnect() {
    this.connected = false;
  }
}

beforeEach(() => {
  observers.clear();
  vi.stubGlobal('MutationObserver', FakeObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

async function fire(node: Node) {
  const observer = observers.get(node)!;
  expect(observer.connected).toBe(true);
  observer.callback([]);
  await Promise.resolve();
}

describe('onNodeTreeMutation', () => {
  it.each([false, true])('observes the subtree with observeClass=%s', observeClass => {
    const node = {} as Node;
    onNodeTreeMutation(node, () => {}, observeClass);
    expect(observers.get(node)?.options).toEqual({
      childList: true,
      subtree: true,
      ...(observeClass ? { attributeFilter: ['class'] } : {}),
    });
  });

  it('batches mutation records in order and clears them after delivery', async () => {
    const node = {} as Node;
    const callback = vi.fn();
    const first = { type: 'childList' } as MutationRecord;
    const second = { type: 'attributes' } as MutationRecord;
    onNodeTreeMutation(node, callback);
    const observer = observers.get(node)!;
    observer.callback([first]);
    observer.callback([second]);
    expect(callback).not.toHaveBeenCalled();
    await Promise.resolve();
    expect(callback).toHaveBeenCalledExactlyOnceWith([first, second]);
    observer.callback([second]);
    await Promise.resolve();
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith([second]);
  });

  it('does not deliver queued mutations after unsubscribe', async () => {
    const node = {} as Node;
    const callback = vi.fn();
    const stop = onNodeTreeMutation(node, callback);
    observers.get(node)!.callback([]);
    stop();
    await Promise.resolve();
    expect(callback).not.toHaveBeenCalled();
  });

  it('does not skip the next callback when a callback unsubscribes itself', async () => {
    const node = {} as Node;
    const log: string[] = [];
    const stopA = onNodeTreeMutation(node, () => {
      log.push('A');
      stopA();
    });
    onNodeTreeMutation(node, () => void log.push('B'));
    await fire(node);
    await fire(node);
    expect(log).toEqual(['A', 'B', 'B']);
  });

  it('does not let an old cleanup remove a new subscription to the same callback', async () => {
    const node = {} as Node;
    const log: string[] = [];
    const callback = () => void log.push('A');
    const stopA = onNodeTreeMutation(node, callback);
    stopA();
    onNodeTreeMutation(node, callback);
    stopA();
    await fire(node);
    expect(log).toEqual(['A']);
  });

  it('keeps subscriptions to the same callback independent', async () => {
    const node = {} as Node;
    const log: string[] = [];
    const callback = () => void log.push('A');
    const stopA = onNodeTreeMutation(node, callback);
    const observer = observers.get(node)!;
    const stopB = onNodeTreeMutation(node, callback);
    expect(observers.get(node)).toBe(observer);
    await fire(node);
    expect(log).toEqual(['A', 'A']);
    stopA();
    stopA();
    expect(observer.connected).toBe(true);
    await fire(node);
    expect(log).toEqual(['A', 'A', 'A']);
    stopB();
    expect(observer.connected).toBe(false);
  });

  it('skips a callback removed by an earlier callback in the batch', async () => {
    const node = {} as Node;
    const log: string[] = [];
    onNodeTreeMutation(node, () => {
      log.push('A');
      stopB();
    });
    const stopB = onNodeTreeMutation(node, () => void log.push('B'));
    onNodeTreeMutation(node, () => void log.push('C'));
    await fire(node);
    expect(log).toEqual(['A', 'C']);
  });

  it('waits until the next batch to run a callback added during dispatch', async () => {
    const node = {} as Node;
    const log: string[] = [];
    onNodeTreeMutation(node, () => {
      log.push('A');
      onNodeTreeMutation(node, () => void log.push('B'));
      return true;
    });
    await fire(node);
    expect(log).toEqual(['A']);
    await fire(node);
    expect(log).toEqual(['A', 'B']);
  });

  it('preserves a replacement observer created during callback cleanup', async () => {
    const node = {} as Node;
    const log: string[] = [];
    const stopA = onNodeTreeMutation(node, () => {
      stopA();
      onNodeTreeMutation(node, () => void log.push('B'));
      return true;
    });
    await fire(node);
    const replacement = observers.get(node)!;
    const stopC = onNodeTreeMutation(node, () => void log.push('C'));
    expect(observers.get(node)).toBe(replacement);
    await fire(node);
    expect(log).toEqual(['B', 'C']);
    stopC();
  });

  it('unsubscribing after the callback self-removed via true is harmless', async () => {
    const node = {} as Node;
    const log: string[] = [];
    const stopA = onNodeTreeMutation(node, () => {
      log.push('A');
      return true;
    });
    const stopB = onNodeTreeMutation(node, () => void log.push('B'));
    await fire(node);
    expect(log).toEqual(['A', 'B']);
    stopA();
    await fire(node);
    expect(log).toEqual(['A', 'B', 'B']);
    stopB();
  });

  it('a throwing callback does not remove the surviving callback', async () => {
    const node = {} as Node;
    const log: string[] = [];
    const error = new Error('Callback failed');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    onNodeTreeMutation(node, () => {
      throw error;
    });
    onNodeTreeMutation(node, () => void log.push('B'));
    await fire(node);
    await fire(node);
    expect(log).toEqual(['B', 'B']);
    expect(consoleError).toHaveBeenCalledExactlyOnceWith(error);
  });
});
