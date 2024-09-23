import onNodeDisconnected from '@src/utils/on-node-disconnected';
import { watch, WatchCallback, WatchOptions, WatchSource, WatchStopHandle } from 'vue';

type MaybeUndefined<T, I> = I extends true ? T | undefined : T;
type MultiWatchSources = (WatchSource<unknown> | object)[];
type MapSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V>
    ? MaybeUndefined<V, Immediate>
    : T[K] extends object
      ? MaybeUndefined<T[K], Immediate>
      : never;
};

export function watchWhileNodeAlive<T, Immediate extends Readonly<boolean> = false>(
  node: Node,
  source: WatchSource<T>,
  cb: WatchCallback<T, MaybeUndefined<T, Immediate>>,
  options?: WatchOptions<Immediate>,
): WatchStopHandle;

export function watchWhileNodeAlive<
  T extends MultiWatchSources,
  Immediate extends Readonly<boolean> = false,
>(
  node: Node,
  sources: [...T],
  cb: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>,
  options?: WatchOptions<Immediate>,
): WatchStopHandle;

export function watchWhileNodeAlive<T extends object, Immediate extends Readonly<boolean> = false>(
  node: Node,
  source: T,
  cb: WatchCallback<T, MaybeUndefined<T, Immediate>>,
  options?: WatchOptions<Immediate>,
): WatchStopHandle;

export function watchWhileNodeAlive<T, Immediate extends Readonly<boolean> = false>(
  node: Node,
  source: WatchSource<T> | T | MultiWatchSources,
  cb: WatchCallback,
  options?: WatchOptions<Immediate>,
): WatchStopHandle {
  const stop = watch(source, cb, options);
  onNodeDisconnected(node, stop);
  return stop;
}
