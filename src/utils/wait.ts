import { sleep } from '@src/utils/sleep';

// Returns true if the condition becomes truthy within the timeout, false otherwise.
export async function waitUntil<T>(condition: () => T, timeout = 5000, interval = 100) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (condition()) {
      return true;
    }
    await sleep(interval);
  }
  return false;
}

// Returns true if the condition becomes falsy within the timeout, false otherwise.
export async function waitWhile<T>(condition: () => T, timeout = 5000, interval = 100) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (!condition()) {
      return true;
    }
    await sleep(interval);
  }
  return false;
}
