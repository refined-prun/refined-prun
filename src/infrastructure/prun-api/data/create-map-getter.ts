import { castArray } from '@src/utils/cast-array';

const upperCase = (value: string) => value.toUpperCase();

export function createMapGetter<T>(
  items: Ref<T[] | undefined>,
  selector: (item: T) => string | null | undefined | (string | null | undefined)[],
  valueTransformer?: (value: string) => string,
) {
  valueTransformer ??= upperCase;
  const map = computed(() => {
    if (items.value === undefined) {
      return undefined;
    }
    const map = new Map<string, T>();
    for (const item of items.value) {
      const values = castArray(selector(item));
      for (const value of values) {
        if (value === null || value === undefined) {
          continue;
        }
        map.set(valueTransformer(value), item);
      }
    }
    return map;
  });
  return (value?: string | null) =>
    map.value !== undefined && value ? map.value.get(valueTransformer(value)) : undefined;
}

export function createGroupMapGetter<T>(
  items: Ref<T[] | undefined>,
  selector: (item: T) => string | null | undefined,
  valueTransformer?: (value: string) => string,
) {
  valueTransformer ??= upperCase;
  const map = computed(() => {
    if (items.value === undefined) {
      return undefined;
    }
    const map = new Map<string, T[]>();
    for (const item of items.value) {
      const value = selector(item);
      if (value === null || value === undefined) {
        continue;
      }
      const key = valueTransformer(value);
      let group = map.get(key);
      if (!group) {
        group = [];
        map.set(key, group);
      }
      group.push(item);
    }
    return map;
  });
  return (value?: string | null) =>
    map.value !== undefined && value ? map.value.get(valueTransformer(value)) : undefined;
}
