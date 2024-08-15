import { computed, Ref } from 'vue';

export function createMapGetter<T, K>(
  items: Ref<T[]>,
  selector: (item: T) => K,
  valueTransformer?: (value: K) => K,
) {
  const map = computed(() => {
    const map = new Map<K, T>();
    for (const item of items.value) {
      map.set(selector(item), item);
    }
    return map;
  });
  if (valueTransformer) {
    return (value?: K | null) => (value ? map.value.get(valueTransformer(value)) : undefined);
  }
  return (value?: K | null) => (value ? map.value.get(value) : undefined);
}

export function createGroupMapGetter<T, K>(
  items: Ref<T[]>,
  selector: (item: T) => K,
  valueTransformer?: (value: K) => K,
) {
  const map = computed(() => {
    const map = new Map<K, T[]>();
    for (const item of items.value) {
      const key = selector(item);
      let group = map.get(key);
      if (!group) {
        group = [];
        map.set(key, group);
      }
      group.push(item);
    }
    return map;
  });
  if (valueTransformer) {
    return (value?: K | null) => (value ? map.value.get(valueTransformer(value)) : undefined);
  }
  return (value?: K | null) => (value ? map.value.get(value) : undefined);
}
