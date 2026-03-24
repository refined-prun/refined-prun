/* eslint-disable @typescript-eslint/no-explicit-any */
import { migrateVersionedUserData } from '@src/store/user-data-versioned-migrations';
import removeArrayElement from '@src/utils/remove-array-element';

type Migration = [id: string, migration: (userData: any) => void];
// A checkpoint marks that all migrations before it are applied.
// If a user's data contains a checkpoint ID, preceding individual IDs can be pruned.
// New checkpoints subsume older ones.
type Checkpoint = [id: string];
type MigrationEntry = Migration | Checkpoint;

function isCheckpoint(entry: MigrationEntry): entry is Checkpoint {
  return entry.length === 1;
}

// New migrations should be added to the top of the list.
// The date is for reference only, and it does not affect migration order.
const migrations: MigrationEntry[] = [
  ['10.03.2026 Checkpoint'],
  [
    '10.03.2026 Remove funny-rations',
    userData => {
      removeFeature(userData, 'funny-rations');
    },
  ],
  [
    '24.01.2026 Remove cxpc-default-1y',
    userData => {
      removeFeature(userData, 'cxpc-default-1y');
    },
  ],
  [
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
    userData.migrations = compactIds(
      orderedMigrations,
      orderedMigrations.map(x => x[0]),
    );
    return userData;
  }

  const performed = new Set<string>(userData.migrations);
  for (let i = orderedMigrations.length - 1; i >= 0; i--) {
    const entry = orderedMigrations[i];
    if (isCheckpoint(entry) && performed.has(entry[0])) {
      for (let j = 0; j < i; j++) {
        performed.add(orderedMigrations[j][0]);
      }
      break;
    }
  }

  for (const entry of orderedMigrations) {
    const id = entry[0];
    if (performed.has(id)) {
      continue;
    }
    if (!isCheckpoint(entry)) {
      entry[1](userData);
    }
    performed.add(id);
    userData.migrations.push(id);
  }

  userData.migrations = compactIds(orderedMigrations, userData.migrations);
  return userData;
}

function compactIds(orderedEntries: MigrationEntry[], appliedIds: string[]): string[] {
  const applied = new Set(appliedIds);

  // Find the latest checkpoint where all preceding entries are applied.
  // An applied older checkpoint means everything before it is implicitly applied.
  let latestCheckpointIndex = -1;
  for (let i = orderedEntries.length - 1; i >= 0; i--) {
    const entry = orderedEntries[i];
    if (!isCheckpoint(entry) || !applied.has(entry[0])) {
      continue;
    }
    let complete = true;
    for (let j = i - 1; j >= 0; j--) {
      if (isCheckpoint(orderedEntries[j]) && applied.has(orderedEntries[j][0])) {
        break;
      }
      if (!applied.has(orderedEntries[j][0])) {
        complete = false;
        break;
      }
    }
    if (complete) {
      latestCheckpointIndex = i;
      break;
    }
  }

  if (latestCheckpointIndex === -1) {
    return appliedIds;
  }

  const removable = new Set<string>();
  for (let i = 0; i < latestCheckpointIndex; i++) {
    removable.add(orderedEntries[i][0]);
  }

  const checkpointId = orderedEntries[latestCheckpointIndex][0];
  const result: string[] = [checkpointId];
  for (const id of appliedIds) {
    if (!removable.has(id) && id !== checkpointId) {
      result.push(id);
    }
  }
  return result;
}
