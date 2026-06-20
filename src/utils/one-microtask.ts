export function oneMicrotask(callback: () => void) {
  let queued = false;
  return () => {
    if (queued) {
      return;
    }
    queued = true;
    queueMicrotask(() => {
      queued = false;
      callback();
    });
  };
}
