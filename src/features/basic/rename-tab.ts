function updateTabTitle() {
import { screensStore } from '@src/infrastructure/prun-api/data/screens';

  const screenName = screensStore.current.value?.name;
  document.title = screenName ? `${screenName} - Prosperous Universe` : 'Prosperous Universe';
}

function init() {
  // Listen for URL changes using the hashchange event
  window.addEventListener('hashchange', updateTabTitle);
  updateTabTitle();
}

features.add(import.meta.url, init, 'Rename browser tab based on the current screen');
