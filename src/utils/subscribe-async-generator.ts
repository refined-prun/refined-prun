export function subscribe<T>(generator: AsyncIterable<T>, callback: (item: T) => void) {
  (async () => {
    for await (const item of generator) {
      callback(item);
    }
  })().catch(e => console.error(e));
}
