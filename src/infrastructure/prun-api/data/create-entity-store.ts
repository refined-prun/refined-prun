import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { PrefixStore } from '@src/utils/prefix-store';

interface EntityStoreOptions<T> {
  selectId?: (model: T) => string;
  transformId?: (id: string) => string;
  preserveOnConnectionOpen?: boolean;
}

export function createEntityStore<T>(options?: EntityStoreOptions<T>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectId = options?.selectId ?? ((model: any) => model.id);
  const transformId = options?.transformId ?? ((s: string) => s.toUpperCase());

  const entitiesRef = shallowRef({} as Record<string, T>);
  const prefixStoreRef = shallowRef(new PrefixStore<T>());
  const fetched = ref(false);

  function rebuildPrefixStore() {
    const entities = entitiesRef.value;
    const prefixStore = prefixStoreRef.value;
    prefixStore.clear();
    for (const key in entities) {
      prefixStore.insert(transformId(key), entities[key]);
    }
    triggerRef(prefixStoreRef);
  }

  if (!options?.preserveOnConnectionOpen) {
    onApiMessage({
      CLIENT_CONNECTION_OPENED() {
        fetched.value = false;
        entitiesRef.value = {};
        prefixStoreRef.value = new PrefixStore<T>();
      },
    });
  }

  return {
    state: {
      fetched,
      entities: computed(() => {
        return fetched.value ? entitiesRef.value : undefined;
      }),
      all: computed(() => (fetched.value ? Object.values(entitiesRef.value) : undefined)),
      getById: (id?: string | null): T | undefined => {
        if (!id || !fetched.value) {
          return undefined;
        }
        const exact = entitiesRef.value[id];
        if (exact !== undefined) {
          return exact;
        }
        return prefixStoreRef.value.findOne(transformId(id));
      },
      getAllById: (id?: string | null): T[] | undefined => {
        if (!id || !fetched.value) {
          return undefined;
        }
        return prefixStoreRef.value.findAll(transformId(id));
      },
    },
    setAll(items: T[]) {
      const entities: Record<string, T> = {};
      for (const item of items) {
        entities[selectId(item)] = item;
      }
      entitiesRef.value = entities;
      rebuildPrefixStore();
    },
    setOne(item: T) {
      const id = selectId(item);
      entitiesRef.value[id] = item;
      triggerRef(entitiesRef);
      prefixStoreRef.value.setOne(transformId(id), item);
      triggerRef(prefixStoreRef);
    },
    setMany(items: T[]) {
      const prefixStore = prefixStoreRef.value;
      for (const item of items) {
        const id = selectId(item);
        entitiesRef.value[id] = item;
        prefixStore.setOne(transformId(id), item);
      }
      triggerRef(entitiesRef);
      triggerRef(prefixStoreRef);
    },
    addOne(item: T) {
      const id = selectId(item);
      if (!entitiesRef.value[id]) {
        entitiesRef.value[id] = item;
        triggerRef(entitiesRef);
        prefixStoreRef.value.insert(transformId(id), item);
        triggerRef(prefixStoreRef);
      }
    },
    updateOne(item: T) {
      const id = selectId(item);
      const entities = entitiesRef.value;
      if (entities[id]) {
        entities[id] = {
          ...entities[id],
          ...item,
        };
        triggerRef(entitiesRef);
        prefixStoreRef.value.setOne(transformId(id), entities[id]);
        triggerRef(prefixStoreRef);
      }
    },
    removeOne(id: string) {
      delete entitiesRef.value[id];
      triggerRef(entitiesRef);
      prefixStoreRef.value.remove(transformId(id));
      triggerRef(prefixStoreRef);
    },
    setFetched() {
      fetched.value = true;
    },
  };
}
