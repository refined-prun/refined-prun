import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';

type EntityId = number | string;
type IdSelector<T, Id extends EntityId> = (model: T) => Id;

export function createEntityStore<T>(
  selectId?: IdSelector<T, string>,
  options?: {
    preserveOnOpen?: boolean;
  },
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectId = selectId ?? ((model: any) => model.id);
  let entities = shallowReactive({} as Record<string, T>);
  const fetched = ref(false);

  if (!options?.preserveOnOpen) {
    onApiMessage({
      CLIENT_CONNECTION_OPENED() {
        fetched.value = false;
        entities = shallowReactive({} as Record<string, T>);
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
      getById: (id?: string | null) => (fetched.value && id ? entities[id] : undefined),
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
