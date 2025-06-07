import { refTextContent } from '@src/utils/reactive-dom';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import { alertsStore } from '@src/infrastructure/prun-api/data/alerts';
import { companyStore } from '@src/infrastructure/prun-api/data/company';

function init() {
  subscribe($$(document, C.AlertsHeadItem.count), count => {
    const actual = refTextContent(count);
    const expected = computed(() => {
      const companyId = companyStore.value?.id;
      const alerts = alertsStore.all.value;
      if (!companyId || !alerts) {
        return undefined;
      }
      const thisCount = alerts.filter(x => x.contextId === companyId && !x.seen).length;
      const otherCount = alerts.filter(x => x.contextId !== companyId && !x.seen).length;
      return otherCount > 0 ? `${thisCount} (${otherCount})` : thisCount.toString();
    });
    watchEffectWhileNodeAlive(count, () => {
      if (expected.value === undefined || actual.value === expected.value) {
        return;
      }

      count.textContent = expected.value;
    });
  });
}

features.add(
  import.meta.url,
  init,
  'Adds a counter for notifications from other contexts in the NOTS header label.',
);
