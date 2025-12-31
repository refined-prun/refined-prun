import { screensStore } from '@src/infrastructure/prun-api/data/screens';
import { alertsStore } from '@src/infrastructure/prun-api/data/alerts';

function init() {
  watchEffect(() => {
    const screenName = screensStore.current.value?.name;
    const notificationCount = alertsStore.all.value?.filter(x => !x.seen).length ?? 0;
    let title = 'Prosperous Universe';
    if (screenName) {
      title = `${screenName} - ${title}`;
    }
    if (notificationCount > 0) {
      title = `(${notificationCount}) ${title}`;
    }
    document.title = title;
  });
}

features.add(import.meta.url, init, 'Renames browser tab based on the current screen');
