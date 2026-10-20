import { fetchJson } from '@src/utils/fetch';

const maxAge = 60 * 60 * 1000;
const state = shallowRef<{ fetchedAt: number; gateways: FioApi.Gateway[] }>();
let loading = false;

export function getFioGateways() {
  if (!state.value || Date.now() - state.value.fetchedAt > maxAge) {
    void load();
  }
  return state.value?.gateways;
}

async function load() {
  if (loading) {
    return;
  }
  loading = true;
  try {
    const gateways = (await fetchJson('https://api.fnar.net/gateway')) as FioApi.Gateway[];
    state.value = { fetchedAt: Date.now(), gateways };
  } catch {
    state.value = { fetchedAt: Date.now(), gateways: state.value?.gateways ?? [] };
  } finally {
    loading = false;
  }
}
