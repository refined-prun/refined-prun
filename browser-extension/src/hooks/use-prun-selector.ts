import { State, store } from '@src/prun-api/data/store';
import { onUnmounted, shallowRef } from 'vue';

export default function usePrunSelector<T>(selector: (state: State) => T) {
  const selected = shallowRef(selector(store.getState()));

  const unsubscribe = store.subscribe(() => {
    selected.value = selector(store.getState());
  });
  onUnmounted(() => unsubscribe());

  return selected;
}
