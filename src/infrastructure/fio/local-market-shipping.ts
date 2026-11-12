import { fetchJson } from '@src/utils/fetch';

export type FioShippingDirection = 'source' | 'destination';

interface Entry {
  fetchedAt: number;
  ads: FioApi.ShippingAd[];
}

const maxAge = 5 * 60 * 1000;
const entries = shallowReactive<Record<string, Entry | undefined>>({});
const inFlight = new Set<string>();

// Reading the result fetches it from FIO in the background when it is missing or old.
export function getFioShippingAds(direction: FioShippingDirection, location: string) {
  const key = `${direction}/${location.toUpperCase()}`;
  const entry = entries[key];
  if (!entry || Date.now() - entry.fetchedAt > maxAge) {
    void load(key);
  }
  return entry;
}

async function load(key: string) {
  if (inFlight.has(key)) {
    return;
  }
  inFlight.add(key);
  try {
    const ads = (await fetchJson(`https://rest.fnar.net/localmarket/shipping/${key}`)) as
      | FioApi.ShippingAd[]
      | null;
    entries[key] = { fetchedAt: Date.now(), ads: ads ?? [] };
  } catch {
    // FIO answers 204 with an empty body for locations without ads.
    entries[key] = { fetchedAt: Date.now(), ads: [] };
  } finally {
    inFlight.delete(key);
  }
}
