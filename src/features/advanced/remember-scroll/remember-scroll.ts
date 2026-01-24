import ScrollButton from '@src/features/advanced/remember-scroll/ScrollButton.vue';
import { getTileState, Scroll } from '@src/features/advanced/remember-scroll/tile-state';
import { computedTileState } from '@src/store/user-data-tiles';

function onTileReady(tile: PrunTile) {
  addScrollLockButton(tile);
  applyInitialScroll(tile);
}

async function applyInitialScroll(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ScrollView.view), scrollView => {
    const savedScroll = computedTileState(getTileState(tile), 'scroll', undefined);
    const scrollToSaved = () => {
      if (savedScroll.value == undefined) {
        return;
      }
      scrollView.scrollTo({
        top: savedScroll.value.top,
        left: savedScroll.value.left,
        behavior: 'instant',
      });
    };
    // In case tile does not need to load (like XIT BURN) scroll immediately
    scrollToSaved();
    // Scroll when scrollable content is loaded for the first time if there is no loader
    const observer = new MutationObserver((_, observer) => {
      const loader = _$(scrollView, C.Loading.loader);
      if (loader !== undefined) {
        return;
      }
      if (
        scrollView.scrollHeight > scrollView.clientHeight ||
        scrollView.scrollWidth > scrollView.clientWidth
      ) {
        scrollToSaved();
        observer.disconnect();
      }
    });
    observer.observe(scrollView, { childList: true, subtree: true });
  });
}

async function addScrollLockButton(tile: PrunTile) {
  const tileControls = await $(tile.frame, C.TileFrame.controls);
  const scrollView = await $(tile.frame, C.ScrollView.view);
  const savedScroll = computedTileState(getTileState(tile), 'scroll', undefined);
  const getCurrentScroll = () => ({ top: scrollView.scrollTop, left: scrollView.scrollLeft });
  const getMaxScroll = () => ({
    top: scrollView.scrollHeight - scrollView.clientHeight,
    left: scrollView.scrollWidth - scrollView.clientWidth,
  });
  const getCanNotScroll = () =>
    !(
      scrollView.scrollHeight > scrollView.clientHeight ||
      scrollView.scrollWidth > scrollView.clientWidth
    );
  const currentScroll = ref(getCurrentScroll());
  const maxScroll = ref(getMaxScroll());
  const canNotScroll = ref(getCanNotScroll());
  scrollView.addEventListener('scroll', () => {
    currentScroll.value = getCurrentScroll();
  });
  // This observes only changes in clientHeight/Width.
  const resizeObserver = new ResizeObserver(() => {
    maxScroll.value = getMaxScroll();
    canNotScroll.value = getCanNotScroll();
  });
  // This indirectly observes changes in scrollHeight/Width.
  const mutationObserver = new MutationObserver(() => {
    maxScroll.value = getMaxScroll();
    canNotScroll.value = getCanNotScroll();
  });
  resizeObserver.observe(scrollView);
  mutationObserver.observe(scrollView, { childList: true, subtree: true });

  createFragmentApp(
    ScrollButton,
    reactive({
      savedScroll,
      currentScroll,
      maxScroll,
      hidden: canNotScroll,
      saveScroll: (scroll: Scroll | undefined) => {
        savedScroll.value = scroll;
      },
      scrollTo: (scroll: Scroll) => {
        scrollView.scrollTo({
          top: scroll.top,
          left: scroll.left,
          behavior: 'smooth',
        });
      },
    }),
  ).prependTo(tileControls);
}

function init() {
  tiles.observeAll(onTileReady);
}

features.add(
  import.meta.url,
  init,
  'Adds a scroll lock button to the buffer header of buffers with scrollable content.',
);
