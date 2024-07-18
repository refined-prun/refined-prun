import { loadLocalJson } from '@src/util';

export async function loadFallbackPacket<T>(name: string) {
  return (await loadLocalJson(`fallback-api-packets/${name}.json`)) as T;
}
