import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { computed, ref, shallowReactive } from 'vue';

const store = createEntityStore<PrunApi.Screen>();
const state = store.state;

const removed = shallowReactive([] as PrunApi.Screen[]);

messages({
  UI_DATA(data: PrunApi.UIData) {
    store.setAll(data.screens);
    removed.length = 0;
    removed.push(...data.removedScreens);
    store.setFetched();
  },
  UI_SCREENS_ADD(data: PrunApi.Screen) {
    store.addOne(data);
  },
  UI_SCREENS_RENAME(data: { id: string; name: string }) {
    const screen = state.getById(data.id);
    if (screen !== undefined) {
      store.setOne({
        ...screen,
        name: data.name,
      });
    }
  },
  UI_SCREENS_DELETE(data: { id: string }) {
    const screen = state.getById(data.id);
    if (!screen) {
      return;
    }
    store.removeOne(data.id);
    removed.unshift(screen);
  },
  UI_SCREENS_UNDELETE() {
    const screen = removed.shift();
    if (!screen) {
      return;
    }
    store.addOne(screen);
  },
});

export const screenHash = ref(undefined as string | undefined);

function updateCurrent() {
  screenHash.value = location.hash.match(/screen=([^&]*)/)?.[1];
}
updateCurrent();

window.addEventListener('locationchange', updateCurrent);
window.addEventListener('hashchange', updateCurrent);

const sorted = computed(() =>
  state.all.value
    ?.filter(x => !x.hidden)
    .sort((a, b) => (a.name === b.name ? 0 : a.name < b.name ? -1 : 1)),
);

const current = computed(
  () => sorted.value?.find(x => x.id === screenHash.value) ?? sorted.value?.[0],
);

export const screensStore = {
  ...state,
  sorted,
  current,
};
