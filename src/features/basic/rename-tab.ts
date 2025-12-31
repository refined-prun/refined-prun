function updateTabTitleFromActiveComponent() {
  const activeElement = document.querySelector(`.${C.HeadItem.indicatorPrimaryActive}`);
  if (!activeElement) {
    return;
  }

  const labelElement = activeElement
    .closest(`.${C.HeadItem.container}`)
    ?.querySelector(`.${C.HeadItem.label}`);
  if (!labelElement) {
    return;
  }

  const screenName = labelElement.textContent?.trim();

  if (screenName) {
    document.title = `${screenName} - Prosperous Universe`;
  } else {
    document.title = 'Prosperous Universe';
  }
}

function init() {
  const observer = new MutationObserver(() => {
    updateTabTitleFromActiveComponent();
  });

  const targetNode = document.querySelector(`.${C.Head.contextAndScreens}`);
  if (targetNode) {
    observer.observe(targetNode, { childList: true, subtree: true });
  }
}

features.add(import.meta.url, init, 'Rename browser tab based on the active screen component.');
