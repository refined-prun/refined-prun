export default function getMapArray<T, K>(map: Map<T, K[]>, key: T) {
  let array = map.get(key);
  if (array === undefined) {
    array = [];
    map.set(key, array);
  }
  return array;
}
