import { screensStore } from '@src/infrastructure/prun-api/data/screens';
import { userData } from '@src/store/user-data';
import removeArrayElement from '@src/utils/remove-array-element';

export function syncState() {
  const sorted = screensStore.sorted.value;
  if (!sorted) {
    return;
  }
  const { order, hidden, folders } = userData.tabs;
  const existingScreenIds = new Set(sorted.map(x => x.id));
  const folderIds = new Set(folders.map(f => f.id));
  const screensInFolders = new Set(folders.flatMap(f => f.screenIds));

  const trackedScreenIds = new Set([...hidden, ...screensInFolders]);
  for (const id of order) {
    if (!folderIds.has(id)) {
      trackedScreenIds.add(id);
    }
  }

  for (const tab of sorted) {
    if (!trackedScreenIds.has(tab.id)) {
      order.push(tab.id);
    }
  }

  for (let i = order.length - 1; i >= 0; i--) {
    const id = order[i];
    if (!folderIds.has(id) && !existingScreenIds.has(id)) {
      order.splice(i, 1);
    }
  }

  for (let i = order.length - 1; i >= 0; i--) {
    if (screensInFolders.has(order[i])) {
      order.splice(i, 1);
    }
  }

  for (const id of hidden.slice()) {
    if (!existingScreenIds.has(id)) {
      removeArrayElement(hidden, id);
    }
  }

  for (const folder of folders) {
    for (let i = folder.screenIds.length - 1; i >= 0; i--) {
      if (!existingScreenIds.has(folder.screenIds[i])) {
        folder.screenIds.splice(i, 1);
      }
    }
  }
}
