// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function migrateUserData(userData: any) {
  userData.version = 1;
  return userData;
}
