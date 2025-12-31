import { screensStore } from '@src/infrastructure/prun-api/data/screens';
import { alertsStore } from '@src/infrastructure/prun-api/data/alerts';

function init() {
  watchEffect(() => {
    const screenName = screensStore.current.value?.name;
    const notificationCount = alertsStore.all.value?.filter(alert => !alert.seen).length ?? 0;
    document.title = `${screenName} - Prosperous Universe`;
    if (notificationCount > 0) {
      document.title = `(${notificationCount}) ${document.title}`;
    }
  });
}

features.add(import.meta.url, init, 'Renames browser tab based on the current screen');
