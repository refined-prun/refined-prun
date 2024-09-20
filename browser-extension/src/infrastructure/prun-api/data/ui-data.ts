import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { computed, ref, shallowReactive } from 'vue';

// Will be initialized before UI, so no need for undefined or fallbacks.
export const uiDataStore = shallowReactive<PrunApi.UIData>({} as PrunApi.UIData);

messages({
  UI_DATA(data: PrunApi.UIData) {
    Object.assign(uiDataStore, data);
  },
});

export const screenHash = ref(undefined as string | undefined);

function updateCurrent() {
  screenHash.value = location.hash.match(/screen=([^&]*)/)?.[1];
}
updateCurrent();

window.addEventListener('locationchange', updateCurrent);
window.addEventListener('hashchange', updateCurrent);

export const currentScreen = computed(
  () => uiDataStore.screens.find(x => x.id === screenHash.value) ?? uiDataStore.screens[0],
);
