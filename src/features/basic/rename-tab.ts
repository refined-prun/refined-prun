function updateTabTitle() {
  const screenName = document
    .querySelector(`.${C.ScreenControls.currentScreenName}`)
    ?.textContent?.trim();
  document.title = screenName ? `${screenName} - Prosperous Universe` : 'Prosperous Universe';
}

function init() {
  // Listen for URL changes using the hashchange event
  window.addEventListener('hashchange', updateTabTitle);
  updateTabTitle();
}

features.add(import.meta.url, init, 'Rename browser tab based on the current screen');
