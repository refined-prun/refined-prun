/* eslint-disable @typescript-eslint/no-explicit-any */
import removeArrayElement from '@src/utils/remove-array-element';

const migrations: Migration[] = [
  userData => {
    removeArrayElement(userData.settings.disabled, 'nots-ship-name');
  },
  userData => {
    removeArrayElement(userData.settings.disabled, 'mtra-sync-amount-slider');
  },
  userData => {
    removeArrayElement(userData.settings.disabled, 'productivity-through-depression');
  },
  userData => {
    userData.settings.buffers = [];
  },
  userData => {
    removeArrayElement(userData.settings.disabled, 'hide-bfrs-button');
  },
  userData => {
    userData.commandLists = [];
  },
  userData => {
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
  },
  userData => {
    userData.tabs = {
      order: [],
      hidden: [],
    };
  },
  // Placeholders of beta version migrations
  () => {},
  () => {},
  () => {},
  () => {},
  () => {},
  () => {},
  () => {},
  () => {},
  // End of placeholders
  userData => {
    // Fast-forward initial user data version.
    userData.version = migrations.length - 1;
  },
];

type Migration = (userData: any) => void;

export function migrateUserData(userData: any) {
  while (userData.version < migrations.length) {
    const migration = migrations.length - userData.version - 1;
    migrations[migration](userData);
    userData.version++;
  }
  return userData;
}
