export function sumBy<T>(array: T[], property: (item: T) => number): number;
export function sumBy<T>(
  array: T[] | undefined,
  property: (item: T) => number | undefined,
): number | undefined;

export function sumBy<T>(
  array: T[] | undefined,
  property: (item: T) => number | undefined,
): number | undefined {
  if (array === undefined) {
    return undefined;
  }
  let result = 0;
  for (const item of array) {
    const value = property(item);
    if (value === undefined) {
      return undefined;
    }
    result += value;
  }
  return result;
}
