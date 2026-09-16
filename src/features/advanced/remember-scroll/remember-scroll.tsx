import { computedTileState } from '@src/store/user-data-tiles';
import { getTileState } from './tile-state';
import TileControlsButton from '@src/components/TileControlsButton.vue';

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
    // In case tile does not need to load (like XIT BURN) scroll immediately.
    scrollToSaved();
    // Scroll when scrollable content is loaded for the first time if there is no loader.
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
  resizeObserver.observe(scrollView);
  // This indirectly observes changes in scrollHeight/Width.
  const mutationObserver = new MutationObserver(() => {
    maxScroll.value = getMaxScroll();
    canNotScroll.value = getCanNotScroll();
  });
  mutationObserver.observe(scrollView, { childList: true, subtree: true });

  const scrollState: ComputedRef<'FORGET' | 'SAVE' | 'RETURN'> = computed(() => {
    if (savedScroll.value == undefined) {
      // If there is no saved scroll, scroll can be saved.
      return 'SAVE';
    }
    if (
      (approximateEquality(currentScroll.value.top, maxScroll.value.top) &&
        savedScroll.value.top > currentScroll.value.top) ||
      (approximateEquality(currentScroll.value.left, maxScroll.value.left) &&
        savedScroll.value.left > currentScroll.value.left)
    ) {
      // If at scroll bound and saved scroll is unreachable, scroll can be forgotten.
      return 'FORGET';
    }
    if (
      approximateEquality(savedScroll.value.left, currentScroll.value.left) &&
      approximateEquality(savedScroll.value.top, currentScroll.value.top)
    ) {
      // If at saved scroll, scroll can be forgotten.
      return 'FORGET';
    } else {
      // If the scroll is saved but not at saved scroll, can scroll to saved scroll.
      return 'RETURN';
    }
  });
  const icon = computed(() => {
    switch (scrollState.value) {
      case 'SAVE':
        return '\uf8cc';
      case 'RETURN':
        return '\uf3c5';
      case 'FORGET':
        return '\ue51f';
    }
  });
  const onClick = computed(() => {
    switch (scrollState.value) {
      case 'SAVE':
        return () => (savedScroll.value = currentScroll.value);
      case 'RETURN':
        return () =>
          scrollView.scrollTo({
            top: savedScroll.value?.top ?? currentScroll.value.top,
            left: savedScroll.value?.left ?? currentScroll.value.left,
            behavior: 'smooth',
          });
      case 'FORGET':
        return () => (savedScroll.value = undefined);
    }
  });
  createFragmentApp(
    TileControlsButton,
    reactive({
      icon,
      onClick,
      hidden: canNotScroll,
    }),
  ).prependTo(tileControls);
}

function approximateEquality(a: number, b: number, within: number = 1) {
  return Math.abs(a - b) < within;
}

function init() {
  tiles.observeAll(onTileReady);
}

features.add(
  import.meta.url,
  init,
  'Adds a scroll lock button to the buffer header of buffers with scrollable content.',
);
