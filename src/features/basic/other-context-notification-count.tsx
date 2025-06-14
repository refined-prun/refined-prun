import $style from './other-context-notification-count.module.css';
import { alertsStore } from '@src/infrastructure/prun-api/data/alerts';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { corporationHoldingsStore } from '@src/infrastructure/prun-api/data/corporation-holdings';
import { createReactiveSpan } from '@src/utils/reactive-element';

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
  const countLabel = computed(() => {
    const companyId = companyStore.value?.id;
    const alerts = alertsStore.all.value;
    if (!companyId || !alerts) {
      return undefined;
    }
    const ignored = contextsToIgnore.value;
    let count = 0;
    for (const alert of alerts) {
      if (alert.seen || ignored.has(alert.contextId)) {
        continue;
      }
      if (alert.contextId !== companyId) {
        count++;
      }
    }
    return count > 0 ? ` (${count})` : undefined;
  });
  subscribe($$(document, C.AlertsHeadItem.count), count => {
    const otherCount = createReactiveSpan(count, countLabel);
    otherCount.classList.add($style.count);
    count.after(otherCount);
  });
}

features.add(
  import.meta.url,
  init,
  'Adds a counter for notifications from other contexts in the NOTS header label.',
);
