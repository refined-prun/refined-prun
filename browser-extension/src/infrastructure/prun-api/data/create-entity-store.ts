import { computed, ref, shallowReactive } from 'vue';

type EntityId = number | string;
type IdSelector<T, Id extends EntityId> = (model: T) => Id;

export function createEntityStore<T>(selectId?: IdSelector<T, string>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectId = selectId ?? ((model: any) => model.id);
  const entities = shallowReactive({} as Record<string, T>);
  const fetched = ref(false);
  return {
    state: {
      entities,
      fetched,
      all: computed(() => Object.values(entities)),
      getById: (id?: string | null) => (id ? entities[id] : undefined),
    },
    setAll(items: T[]) {
      for (const key in entities) {
        delete entities[key];
      }
      for (const item of items) {
        entities[selectId(item)] = item;
      }
    },
    setOne(item: T) {
      entities[selectId(item)] = item;
    },
    setMany(items: T[]) {
      for (const item of items) {
        entities[selectId(item)] = item;
      }
    },
    addOne(item: T) {
      const id = selectId(item);
      if (!entities[id]) {
        entities[id] = item;
      }
    },
    removeOne(id: string) {
      delete entities[id];
    },
    setFetched() {
      fetched.value = true;
    },
  };
}
