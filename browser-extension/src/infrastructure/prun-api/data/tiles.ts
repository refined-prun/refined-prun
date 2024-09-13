import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { settings } from '@src/store/settings';
import { App, computed, inject, InjectionKey, reactive, Ref, watch, Plugin } from 'vue';

const store = createEntityStore<PrunApi.Tile>();
const state = store.state;

messages({
  UI_DATA(data: PrunApi.UIData) {
    store.setAll(data.tiles);
    for (const key of Object.keys(settings.tileState)) {
      if (!state.entities[key]) {
        removeTileState(key);
      }
    }
  },
  UI_TILES_CHANGE_COMMAND(data: { id: string; newCommand: string | null }) {
    const tile = state.getById(data.id);
    if (!tile) {
      return;
    }

    store.setOne({
      ...tile,
      content: data.newCommand,
    });
    removeTileState(data.id);
  },
  UI_TILES_MOVE(data: { sourceId: string; targetId: string; content: string }) {
    const source = state.getById(data.sourceId);
    if (!source) {
      return;
    }

    const target = state.getById(data.targetId);
    if (!target) {
      return;
    }

    store.setOne({
      ...source,
      content: null,
    });
    store.setOne({
      ...target,
      content: data.content,
    });
    moveTileState(data.sourceId, data.targetId);
  },
  UI_TILES_SPLIT(data: { id: string; newId1: string; newId2: string; vertically: boolean }) {
    const tile = state.getById(data.id);
    if (!tile) {
      return;
    }

    store.setOne({
      id: data.newId1,
      parentId: data.id,
      content: tile.content,
      container: null,
    });

    store.setOne({
      id: data.newId2,
      parentId: data.id,
      content: null,
      container: null,
    });

    store.setOne({
      ...tile,
      content: null,
      container: {
        child1Id: data.newId1,
        child2Id: data.newId2,
        vertical: data.vertically,
        dividerPosition: 0.5,
      },
    });

    moveTileState(data.id, data.newId1);
  },
  UI_TILES_REMOVE(data: { id: string }) {
    const tile = state.getById(data.id);
    if (!tile) {
      return;
    }

    const parent = state.getById(tile.parentId);
    const container = parent?.container;
    if (!container) {
      return;
    }

    const otherId = container.child1Id !== data.id ? container.child1Id : container.child1Id;
    const other = state.getById(otherId);
    if (!other) {
      return;
    }

    store.setOne({
      ...parent,
      container: null,
      content: other.content,
    });
    store.removeOne(tile.id);
    store.removeOne(other.id);

    removeTileState(tile.id);
    moveTileState(other.id, parent.id);
  },
  UI_TILES_CHANGE_SIZE(data: { id: string; newDividerPosition: number }) {
    const tile = state.getById(data.id);
    if (!tile || !tile.container) {
      return;
    }

    store.setOne({
      ...tile,
      container: {
        ...tile.container,
        dividerPosition: data.newDividerPosition,
      },
    });
  },
});

function removeTileState(id: string) {
  delete settings.tileState[id];
}

function moveTileState(fromId: string, toId: string) {
  if (settings.tileState[fromId]) {
    settings.tileState[toId] = settings.tileState[fromId];
    removeTileState(fromId);
  }
}

function getTileState<T extends BaseTileState>(tileOrId: PrunTile | string) {
  const id = typeof tileOrId === 'string' ? tileOrId : tileOrId.id;
  let state = settings.tileState[id];
  let isAdded = state !== undefined;
  if (!state) {
    state = reactive({});
  }
  watch(
    state,
    () => {
      const hasKeys = Object.keys(state).length > 0;
      if (hasKeys && !isAdded) {
        settings.tileState[id] = state;
        isAdded = true;
      }
      if (!hasKeys && isAdded) {
        delete settings.tileState[id];
        isAdded = false;
      }
    },
    { deep: true },
  );
  return state as T;
}

const baseTileStateKey = Symbol() as InjectionKey<Ref<BaseTileState>>;

export function tileStateKey<T extends BaseTileState>() {
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

export function createTileStateHook<T extends BaseTileState>(defaultState: T) {
  deepFreeze(defaultState);
  return function useTileState<K extends keyof T>(key: K) {
    const state = inject(tileStateKey<T>())!;
    return computed({
      get: () => state.value[key] ?? defaultState[key],
      set: value => {
        if (Array.isArray(value) && value.length === 0) {
          delete state.value[key];
          return;
        }
        if (value === defaultState[key]) {
          delete state.value[key];
          return;
        }
        state.value[key] = value;
      },
    });
  };
}

function deepFreeze(object: object) {
  const propNames = Reflect.ownKeys(object);
  for (const name of propNames) {
    const value = object[name];
    if ((value && typeof value === 'object') || typeof value === 'function') {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

export const tilesStore = {
  ...state,
  getTileState,
};
