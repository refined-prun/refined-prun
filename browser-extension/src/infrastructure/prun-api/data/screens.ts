import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { shallowReactive } from 'vue';

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

export const screensStore = {
  ...state,
};
