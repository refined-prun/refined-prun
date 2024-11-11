import { watchEffect, WatchEffect, WatchOptionsBase } from 'vue';
import onNodeDisconnected from '@src/utils/on-node-disconnected';

export function watchEffectWhileNodeAlive(
  node: Node,
  effect: WatchEffect,
  options?: WatchOptionsBase,
) {
  const stop = watchEffect(effect, options);
  onNodeDisconnected(node, stop);
  return stop;
}
