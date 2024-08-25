import { isRef, Ref } from 'vue';

export function sumBy<T>(array: T[] | Ref<T[]>, property: (item: T) => number) {
  array = isRef(array) ? array.value : array;
  let result = 0;
  for (const item of array) {
    result += property(item);
  }
  return result;
}
