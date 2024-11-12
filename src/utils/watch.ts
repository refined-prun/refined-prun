import { WatchStopHandle } from 'vue';

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
