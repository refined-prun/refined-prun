import $style from './other-context-notification-count.module.css';
import { alertsStore } from '@src/infrastructure/prun-api/data/alerts';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { createReactiveSpan } from '@src/utils/reactive-element';

function init() {
  // There is a bug in the base game where some notifications
  // are being sent to the wrong context. We need to ignore them.
  const buggyNotificationTypes = new Set([
    // https://com.prosperousuniverse.com/t/corporation-invite-notifications-are-being-sent-to-a-wrong-context/7078
    'CORPORATION_MANAGER_INVITE_ACCEPTED',
    'CORPORATION_MANAGER_INVITE_REJECTED',

    // https://discord.com/channels/350171287785701388/535426425495355402/1451941402694127678
    // (in the #behind-the-scenes channel)
    'INFRASTRUCTURE_UPGRADE_COMPLETED',
  ]);
  const countLabel = computed(() => {
    const companyId = companyStore.value?.id;
    const alerts = alertsStore.all.value;
    if (!companyId || !alerts) {
      return undefined;
    }
    let count = 0;
    for (const alert of alerts) {
      if (alert.seen) {
        continue;
      }
      if (alert.contextId !== companyId && !buggyNotificationTypes.has(alert.type)) {
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
