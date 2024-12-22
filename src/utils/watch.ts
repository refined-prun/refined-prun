import { WatchEffect, WatchOptionsBase, WatchStopHandle } from 'vue';
import onNodeDisconnected from '@src/utils/on-node-disconnected';

export async function watchUntil(condition: Ref<boolean> | (() => boolean)) {
  await new Promise<void>(resolve => {
    let unwatch: WatchStopHandle | undefined = undefined;
    unwatch = watch(
      condition,
      result => {
        if (result) {
          unwatch?.();
          resolve();
        }
      },
      { immediate: true },
    );
  });
}

export async function watchWhile(condition: Ref<boolean> | (() => boolean)) {
  await new Promise<void>(resolve => {
    let unwatch: WatchStopHandle | undefined = undefined;
    unwatch = watch(
      condition,
      result => {
        if (!result) {
          unwatch?.();
          resolve();
        }
      },
      { immediate: true },
    );
  });
}

export function watchEffectWhileNodeAlive(
  node: Node,
  effect: WatchEffect,
  options?: WatchOptionsBase,
) {
  const stop = watchEffect(effect, options);
  onNodeDisconnected(node, stop);
  return stop;
}
