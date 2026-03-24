import { screensStore } from '@src/infrastructure/prun-api/data/screens';
import { refTextContent } from '@src/utils/reactive-dom';
import { reachableAlerts } from '@src/core/alerts';

async function init() {
  const title = await $(document, 'title');
  const titleText = refTextContent(title);
  const newTitleText = computed(() => {
    const screenName = screensStore.current.value?.name;
    const notificationCount = reachableAlerts.value?.filter(x => !x.seen).length ?? 0;
    let title = 'Prosperous Universe';
    if (screenName !== undefined) {
      title = `${screenName} - ${title}`;
    }
    if (notificationCount > 0) {
      title = `(${notificationCount}) ${title}`;
    }
    return title;
  });
  watchEffect(() => {
    if (titleText.value !== newTitleText.value) {
      title.textContent = newTitleText.value;
    }
  });
}

features.add(import.meta.url, init, 'Renames browser tab based on the current screen');
