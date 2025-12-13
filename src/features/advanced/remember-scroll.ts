import { userData } from '@src/store/user-data.ts';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ScrollView.view), scrollView => {
    const updateScroll = () => {
      if (userData.scroll[tile.id] !== undefined) {
        if (userData.scroll[tile.id].top !== undefined) {
          scrollView.scrollTop = userData.scroll[tile.id].top ?? 0;
        }
        if (userData.scroll[tile.id].left !== undefined) {
          scrollView.scrollLeft = userData.scroll[tile.id].left ?? 0;
        }
      }
    };
    updateScroll(); // In case tile does not need to load (like XIT BURN) scroll immediately
    const observer = new MutationObserver((mutationsList, observer) => {
      // Listen for changes in children and scroll when scrollable content is loaded for the first time
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              !(node as HTMLElement).classList.contains(C.Loading.loader) && // Element is not loader
              (scrollView.scrollHeight > scrollView.clientHeight || // Scrollview has vertically scrollable content
                scrollView.scrollWidth > scrollView.clientWidth) // Scrollview has horizontally scrollable content
            ) {
              updateScroll();
              observer.disconnect(); // Stop waiting for scrollable content
            }
          });
        }
      }
    });
    observer.observe(scrollView, { childList: true, subtree: true });

    scrollView.addEventListener('scrollend', () => {
      userData.scroll[tile.id] = {
        top: scrollView.scrollTop,
        left: scrollView.scrollLeft,
      };
    });
  });
}

function init() {
  tiles.observeAll(onTileReady);
}

features.add(import.meta.url, init, 'Remembers all tile scroll positions');
