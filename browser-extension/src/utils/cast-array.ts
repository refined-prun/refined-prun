export function castArray<Item>(value: Item | Item[]): Item[] {
  return Array.isArray(value) ? value : [value];
}
