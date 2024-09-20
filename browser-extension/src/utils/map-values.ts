type MapValuesArgs = (NonNullable<unknown> | undefined)[];
type SelectorArgs<T extends MapValuesArgs> = { [P in keyof T]: Exclude<T[P], undefined> };

export function map<T extends MapValuesArgs, K>(
  values: T,
  selector: (...values: SelectorArgs<T>) => K,
): K | undefined {
  const args: unknown[] = [];
  for (const value of values) {
    if (value === undefined) {
      return undefined;
    }
    args.push(value);
  }

  return selector(...(args as SelectorArgs<T>));
}
