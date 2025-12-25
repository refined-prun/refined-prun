/* eslint-disable @typescript-eslint/no-explicit-any */
import { migrateVersionedUserData } from '@src/store/user-data-versioned-migrations.ts';

type Migration = [id: string, migration: (userData: any) => void];

// New migrations should be added to the top of the list.
const migrations: Migration[] = [];

export function migrateUserData(userData: any) {
  // The migrations are ordered from newest to oldest, but we want to run them in order.
  const orderedMigrations = migrations.toReversed();
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
