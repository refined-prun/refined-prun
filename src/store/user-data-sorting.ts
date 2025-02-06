import { userData } from '@src/store/user-data';
import { getInvStoreId } from '@src/core/store-id';

const cache = new Map<string, UserData.StoreSortingData>();

export function getSortingData(storeId: string): UserData.StoreSortingData {
  const store = getInvStoreId(storeId);
  if (!store) {
    return {
      modes: [],
    };
  }

  if (cache.has(store.id)) {
    return cache.get(store.id)!;
  }

  let data = userData.sorting[store.id];
  let added = data !== undefined;
  if (!data) {
    data = reactive({
      modes: [],
    });
  }
  watch(
    data,
    () => {
      const isEmpty =
        data.modes.length === 0 &&
        data.cat === undefined &&
        data.reverse === undefined &&
        data.active === undefined;
      if (isEmpty && added) {
        delete userData.sorting[store.id];
        added = false;
      }
      if (!isEmpty && !added) {
        userData.sorting[store.id] = data;
        added = true;
      }
    },
    { deep: true },
  );
  cache.set(store.id, data);
  return data;
}
