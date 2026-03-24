export function isValidPackageName(name: string) {
  return /^[ 0-9a-zA-Z.-]*$/.test(name);
}
