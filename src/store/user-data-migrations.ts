/* eslint-disable @typescript-eslint/no-explicit-any */
import { migrateVersionedUserData } from '@src/store/user-data-versioned-migrations';
import removeArrayElement from '@src/utils/remove-array-element';

type Migration = [id: string, migration: (userData: any) => void];

// New migrations should be added to the top of the list.
const migrations: Migration[] = [
  [
    '24.01.2026 Remove cxpc-default-1y',
    userData => {
      removeFeature(userData, 'cxpc-default-1y');
    },
  ],
  [
    // Whoops, it should be 02.01.2026 lol. Doesn't matter, though.
    '02.02.2026 Add full equity mode',
    userData => {
      userData.fullEquityMode = true;
    },
  ],
  [
    '25.12.2025 Rename features',
    userData => {
      renameFeature(userData, 'custom-item-sorting', 'inv-custom-item-sorting');
      renameFeature(userData, 'item-markers', 'inv-item-markers');
      renameFeature(userData, 'show-space-remaining', 'inv-show-space-remaining');
    },
  ],
  [
    '25.12.2025 Add audio volume',
    userData => {
      userData.settings.audioVolume = 0.4;
    },
  ],
];

function removeFeature(userData: any, feature: string) {
  removeArrayElement(userData.settings.disabled, feature);
}

function renameFeature(userData: any, oldName: string, newName: string) {
  const disabled = userData.settings.disabled;
  const index = disabled.indexOf(oldName);
  if (index !== -1) {
    disabled[index] = newName;
  }
}

export function migrateUserData(userData: any) {
  // The migrations are ordered from newest to oldest, but we want to run them in order.
  const orderedMigrations = migrations.slice().reverse();
  if (userData.version !== undefined) {
    migrateVersionedUserData(userData);
    delete userData.version;
    // After the versioned migration, we should run all the named migrations.
    // Setting the migration list to an empty array will trigger that.
    userData.migrations = [];
  }
  if (userData.migrations === undefined) {
    // The initial user data is already migrated, so just add all migrations to the list.
    userData.migrations = orderedMigrations.map(x => x[0]);
  }
  const performed = new Set(userData.migrations);
  for (const [id, migration] of orderedMigrations) {
    if (!performed.has(id)) {
      migration(userData);
      userData.migrations.push(id);
    }
  }
  return userData;
}
