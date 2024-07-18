import { loadLocalJson } from '@src/util';

export async function loadFallbackPacket<T>(name: string) {
  return (await loadLocalJson(`fallback-api-packets/${name}.json`)) as T;
}

export async function loadFallbackFioResponse<T>(name: string) {
  return (await loadLocalJson(`fallback-fio-responses/${name}.json`)) as T;
}
