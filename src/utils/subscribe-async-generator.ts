export function subscribe<T>(generator: AsyncIterable<T>, callback: (item: T) => void) {
  (async () => {
    try {
      for await (const item of generator) {
        callback(item);
      }
    } catch (e) {
      console.error(e);
    }
  })();
}
