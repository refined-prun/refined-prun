function updateTabTitleFromHeadItem() {
  const headItemContainer = document.querySelector(`.${C.HeadItem.container}`);
  if (!headItemContainer) return;

  const screenNameElement = headItemContainer.querySelector(
    `.${C.ScreenControls.currentScreenName}`,
  );
  const screenName = screenNameElement?.textContent?.trim();

  document.title = screenName ? `${screenName} - Prosperous Universe` : 'Prosperous Universe';
}

function init() {
  const headItemContainer = document.querySelector(`.${C.HeadItem.container}`);
  if (headItemContainer) {
    const observer = new MutationObserver(updateTabTitleFromHeadItem);
    observer.observe(headItemContainer, { childList: true, subtree: true });
  }
  updateTabTitleFromHeadItem();
}

features.add(import.meta.url, init, 'Rename browser tab based on the HeadItem component.');
