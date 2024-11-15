/* eslint-disable @typescript-eslint/no-explicit-any */

const migrations: Migration[] = [
  userData => {
    userData.todo = [];
  },
  userData => {
    userData.systemMessages = [];
  },
  userData => {
    userData.settings.disabled = [];
    userData.settings.pricing.method = 'DEFAULT';
    delete userData.first;
  },
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
