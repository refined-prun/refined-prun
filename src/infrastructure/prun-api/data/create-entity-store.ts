import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { PrefixStore } from '@src/utils/prefix-store';

type EntityId = number | string;
type IdSelector<T, Id extends EntityId> = (model: T) => Id;

export function createEntityStore<T>(
  selectId?: IdSelector<T, string>,
  options?: {
    preserveOnConnectionOpen?: boolean;
  },
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectId = selectId ?? ((model: any) => model.id);
  const transformId = (s: string) => s.toUpperCase();

  let entities = shallowReactive({} as Record<string, T>);
  const prefixStoreRef = shallowRef(new PrefixStore<T>());
  const fetched = ref(false);

  function rebuildPrefixStore() {
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
        entities = shallowReactive({} as Record<string, T>);
        prefixStoreRef.value = new PrefixStore<T>();
      },
    });
  }

  return {
    state: {
      fetched,
      entities: computed(() => {
        return fetched.value ? entities : undefined;
      }),
      all: computed(() => (fetched.value ? Object.values(entities) : undefined)),
      getById: (id?: string | null): T | undefined => {
        if (!id || !fetched.value) {
          return undefined;
        }
        const exact = entities[id];
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
      for (const key in entities) {
        delete entities[key];
      }
      for (const item of items) {
        entities[selectId(item)] = item;
      }
      rebuildPrefixStore();
    },
    setOne(item: T) {
      const id = selectId(item);
      entities[id] = item;
      prefixStoreRef.value.setOne(transformId(id), item);
      triggerRef(prefixStoreRef);
    },
    setMany(items: T[]) {
      const prefixStore = prefixStoreRef.value;
      for (const item of items) {
        const id = selectId(item);
        entities[id] = item;
        prefixStore.setOne(transformId(id), item);
      }
      triggerRef(prefixStoreRef);
    },
    addOne(item: T) {
      const id = selectId(item);
      if (!entities[id]) {
        entities[id] = item;
        prefixStoreRef.value.insert(transformId(id), item);
        triggerRef(prefixStoreRef);
      }
    },
    updateOne(item: T) {
      const id = selectId(item);
      if (entities[id]) {
        entities[id] = {
          ...entities[id],
          ...item,
        };
        prefixStoreRef.value.setOne(transformId(id), entities[id]);
        triggerRef(prefixStoreRef);
      }
    },
    removeOne(id: string) {
      delete entities[id];
      prefixStoreRef.value.remove(transformId(id));
      triggerRef(prefixStoreRef);
    },
    setFetched() {
      fetched.value = true;
    },
  };
}
