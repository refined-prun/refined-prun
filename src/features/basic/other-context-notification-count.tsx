import { refTextContent } from '@src/utils/reactive-dom';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import { alertsStore } from '@src/infrastructure/prun-api/data/alerts';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { corporationHoldingsStore } from '@src/infrastructure/prun-api/data/corporation-holdings';

function init() {
  // There is a bug in the base game where notifications from corporations
  // are being sent to the wrong context. We need to ignore them.
  const contextsToIgnore = computed(() => {
    const set = new Set<string>();
    for (const holding of corporationHoldingsStore.all.value ?? []) {
      set.add(holding.corporation.id);
    }
    return set;
  });
  const expected = computed(() => {
    const companyId = companyStore.value?.id;
    const alerts = alertsStore.all.value;
    if (!companyId || !alerts) {
      return undefined;
    }
    const ignored = contextsToIgnore.value;
    let thisCount = 0;
    let otherCount = 0;
    for (const alert of alerts) {
      if (alert.seen || ignored.has(alert.contextId)) {
        continue;
      }
      if (alert.contextId === companyId) {
        thisCount++;
      } else {
        otherCount++;
      }
    }
    return otherCount > 0 ? `${thisCount} (${otherCount})` : thisCount.toString();
  });
  subscribe($$(document, C.AlertsHeadItem.count), count => {
    const actual = refTextContent(count);
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
