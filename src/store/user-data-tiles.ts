import { userData } from '@src/store/user-data';
import { App, Plugin } from 'vue';
import { deepFreeze } from '@src/utils/deep-freeze';
import { tilesStore } from '@src/infrastructure/prun-api/data/tiles';
import { isEmpty } from 'ts-extras';

type TileState = UserData.TileState;

export function initializeTileListener() {
  pruneTileStates();
  tilesStore.listener = {
    tilesInitialized() {
      pruneTileStates();
    },
    tileMoved(fromId: string, toId: string) {
      moveTileState(fromId, toId);
    },
    tileRemoved(id: string) {
      removeTileState(id);
    },
  };
}

function pruneTileStates() {
  for (const key of Object.keys(userData.tileState)) {
    if (!tilesStore.entities.value![key]) {
      removeTileState(key);
    }
  }
}

function removeTileState(id: string) {
  delete userData.tileState[id];
}

function moveTileState(fromId: string, toId: string) {
  if (userData.tileState[fromId]) {
    userData.tileState[toId] = userData.tileState[fromId];
    removeTileState(fromId);
  }
}

export function getTileState<T extends TileState>(tileOrId: PrunTile | string) {
  const id = typeof tileOrId === 'string' ? tileOrId : tileOrId.id;
  let state = userData.tileState[id];
  let isAdded = state !== undefined;
  if (!state) {
    state = reactive({});
  }
  const isPersistent = isNaN(Number(id));
  if (isPersistent) {
    watch(
      state,
      () => {
        const hasKeys = Object.keys(state).length > 0;
        if (hasKeys && !isAdded) {
          userData.tileState[id] = state;
          isAdded = true;
        }
        if (!hasKeys && isAdded) {
          delete userData.tileState[id];
          isAdded = false;
        }
      },
      { deep: true },
    );
  }
  return state as T;
}

const baseTileStateKey = Symbol() as InjectionKey<Ref<TileState>>;

export function tileStateKey<T extends TileState>() {
  return baseTileStateKey as InjectionKey<Ref<T>>;
}

export const tileStatePlugin: Plugin = {
  install: (app: App, options: { tile: PrunTile | string }) => {
    app.provide(
      tileStateKey(),
      computed(() => getTileState(options.tile)),
    );
  },
};

export function createTileStateHook<T extends TileState>(defaultState: T) {
  deepFreeze(defaultState);
  return function useTileState<K extends keyof T>(key: K) {
    const state = inject(tileStateKey<T>())!;
    return computedTileState(state, key, defaultState[key]);
  };
}

export function useTileState<T>(key: string, defaultValue: T): WritableComputedRef<T> {
  const state = inject(tileStateKey())!;
  return computedTileState(state, key, defaultValue) as WritableComputedRef<T>;
}

export function computedTileState<T extends TileState, K extends keyof T>(
  state: Ref<T>,
  key: K,
  defaultValue: T[K],
) {
  return computed({
    get: () => {
      // Touch property to trigger reactivity
      const value = state.value[key];
      return Object.hasOwn(state.value, key) ? value : defaultValue;
    },
    set: value => {
      if (Array.isArray(value) && isEmpty(value)) {
        delete state.value[key];
        return;
      } else if (typeof value === 'object' && Object.keys(value as object).length === 0) {
        delete state.value[key];
        return;
      }
      if (value === defaultValue) {
        delete state.value[key];
        return;
      }
      state.value[key] = value!;
    },
  });
}
