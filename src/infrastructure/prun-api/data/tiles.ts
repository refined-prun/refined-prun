import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { messages } from '@src/infrastructure/prun-api/data/api-messages';

const store = createEntityStore<PrunApi.Tile>();
const state = store.state;

messages({
  UI_DATA(data: PrunApi.UIData) {
    store.setAll(data.tiles);
    store.setFetched();
    tilesStore.listener.tilesInitialized();
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
    tilesStore.listener.tileRemoved(data.id);
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
    tilesStore.listener.tileMoved(data.sourceId, data.targetId);
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

    tilesStore.listener.tileMoved(data.id, data.newId1);
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

    tilesStore.listener.tileRemoved(tile.id);
    tilesStore.listener.tileMoved(other.id, parent.id);
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

interface ChangeListener {
  tilesInitialized(): void;

  tileMoved(fromId: string, toId: string): void;

  tileRemoved(id: string): void;
}

export const tilesStore = {
  ...state,
  listener: {
    tilesInitialized() {},
    tileMoved() {},
    tileRemoved() {},
  } as ChangeListener,
};
