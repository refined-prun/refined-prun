/* eslint-disable @typescript-eslint/no-explicit-any */
import removeArrayElement from '@src/utils/remove-array-element';
import { tilesStore } from '@src/infrastructure/prun-api/data/tiles';
import { getInvStore } from '@src/core/store-id';

// This is an old migration system that used a version number.
// It is left here for old user data that was created before the named migrations were implemented.
// New migrations should not use this approach. See user-data-migrations.ts.
export function migrateVersionedUserData(userData: any) {
  if (userData.version < 10) {
    userData.tabs = {
      order: [],
      hidden: [],
    };
  }

  if (userData.version < 11) {
    function convertDueDate(task: any) {
      if (task.dueDate) {
        const [year, month, day] = task.dueDate.split('-').map(x => parseInt(x, 10));
        // Month is 0-based
        const date = new Date(year, month - 1, day);
        task.dueDate = date.getTime();
      }
      if (task.subtasks) {
        for (const subtask of task.subtasks) {
          convertDueDate(subtask);
        }
      }
    }

    for (const list of userData.todo) {
      for (const task of list.tasks) {
        convertDueDate(task);
      }
    }
  }

  if (userData.version < 12) {
    userData.commandLists = [];
  }

  if (userData.version < 13) {
    removeFeature(userData, 'hide-bfrs-button');
  }

  if (userData.version < 14) {
    userData.settings.buffers = [];
  }

  if (userData.version < 15) {
    removeFeature(userData, 'productivity-through-depression');
  }

  if (userData.version < 16) {
    removeFeature(userData, 'mtra-sync-amount-slider');
  }

  if (userData.version < 17) {
    removeFeature(userData, 'nots-ship-name');
  }

  if (userData.version < 18) {
    const sorting = {} as Record<string, any>;
    for (const mode of userData.sorting) {
      const store = getInvStore(mode.storeId);
      if (!store) {
        continue;
      }
      const storeSorting = (sorting[store.id] ??= { modes: [] });
      storeSorting.modes.push(mode);
      delete mode.storeId;
    }
    userData.sorting = sorting;
    for (const tileId of Object.keys(userData.tileState)) {
      const tile = tilesStore.getById(tileId);
      if (!tile?.content?.startsWith('INV')) {
        continue;
      }
      const storeId = tile.content.substring(3);
      const store = getInvStore(storeId);
      const state = userData.tileState[tileId];
      if (store) {
        const storeSorting = (sorting[store.id] ??= { modes: [] });
        storeSorting.active = state.activeSort !== undefined ? state.activeSort : undefined;
        storeSorting.cat = state.catSort !== undefined ? state.catSort : undefined;
        storeSorting.reverse = state.reverseSort !== undefined ? state.reverseSort : undefined;
      }
      delete state.activeSort;
      delete state.catSort;
      delete state.reverseSort;
    }
  }

  if (userData.version < 19) {
    removeFeature(userData, 'contd-fill-condition-address');
  }

  if (userData.version < 20) {
    removeFeature(userData, 'shipment-item-detail');
  }

  if (userData.version < 21) {
    userData.settings.defaultChartType = 'SMOOTH';
  }

  if (userData.version < 22) {
    userData.tabs.locked = [];
  }

  if (userData.version < 23) {
    for (const data of Object.values(userData.sorting) as any[]) {
      for (const mode of data.modes) {
        delete mode.storeId;
      }
    }
  }
}

function removeFeature(userData: any, feature: string) {
  removeArrayElement(userData.settings.disabled, feature);
}
