function updateTabTitle() {
import { screensStore } from '@src/infrastructure/prun-api/data/screens';

  const screenName = screensStore.current.value?.name;
  watchEffect(() => {
    const screenName = screensStore.current.value?.name;
    const notificationCount = alertsStore.all.value?.count ?? 0;
    document.title = // do your logic here;
  });
}

function init() {
  // Listen for URL changes using the hashchange event
  window.addEventListener('hashchange', updateTabTitle);
  updateTabTitle();
}

features.add(import.meta.url, init, 'Rename browser tab based on the current screen');
