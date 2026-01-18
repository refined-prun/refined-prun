import $style from './other-context-notification-count.module.css';
import { alertsStore } from '@src/infrastructure/prun-api/data/alerts';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { createReactiveSpan } from '@src/utils/reactive-element';
import { userDataStore } from '@src/infrastructure/prun-api/data/user-data';

function init() {
  const otherContextIds = computed(() => {
    const ids = userDataStore.contexts.map(x => x.id).filter(x => x !== companyStore.value?.id);
    return new Set(ids);
  });
  const countLabel = computed(() => {
    const alerts = alertsStore.all.value;
    if (!alerts) {
      return undefined;
    }
    let count = 0;
    for (const alert of alerts) {
      if (alert.seen) {
        continue;
      }
      if (otherContextIds.value.has(alert.contextId)) {
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
