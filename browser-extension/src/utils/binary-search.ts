export function binarySearch<T>(value: number, items: T[], selector: (item: T) => number) {
  let low = 0;
  let high = items.length;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (selector(items[mid]) < value) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low;
}
