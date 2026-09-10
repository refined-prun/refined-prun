import { alertsStore } from '@src/infrastructure/prun-api/data/alerts';
import { userDataStore } from '@src/infrastructure/prun-api/data/user-data';

const reachableContextIds = computed(() => new Set(userDataStore.contexts.map(x => x.id)));

export const reachableAlerts = computed(() =>
  alertsStore.all.value?.filter(x => reachableContextIds.value.has(x.contextId)),
);
