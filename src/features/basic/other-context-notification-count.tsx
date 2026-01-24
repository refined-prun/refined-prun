import $style from './other-context-notification-count.module.css';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { createReactiveSpan } from '@src/utils/reactive-element';
import { reachableAlerts } from '@src/core/alerts';

function init() {
  const countLabel = computed(() => {
    const alerts = reachableAlerts.value;
    if (!alerts) {
      return undefined;
    }
    let count = 0;
    for (const alert of alerts) {
      if (alert.seen) {
        continue;
      }
      if (alert.contextId !== companyStore.value?.id) {
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
