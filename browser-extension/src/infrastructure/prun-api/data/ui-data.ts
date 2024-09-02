import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { computed, ref, shallowReactive } from 'vue';

// ¯\_(ツ)_/¯
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uiDataStore = shallowReactive<PrunApi.UIData>({} as any);

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
