export function sum(...values: number[]): number;
export function sum(...values: (number | undefined)[]): number | undefined;

export function sum(...values: (number | undefined)[]): number | undefined {
  let result = 0;
  for (const item of values) {
    if (item === undefined) {
      return undefined;
    }
    result += item;
  }
  return result;
}
