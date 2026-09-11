import { useTile } from '@src/hooks/use-tile';

// Grows a floating buffer's height at mount so the tile's overflowing
// content (table rows, action bar) is fully visible.
export function useMinBufferHeight() {
  const tile = useTile();
  onMounted(async () => {
    await nextTick();
    const windowEl = tile.frame.closest(`.${C.Window.window}`);
    const bodyEl = windowEl ? (_$(windowEl, C.Window.body) as HTMLElement | null) : null;
    if (!bodyEl) {
      return;
    }
    let overflow = 0;
    for (const el of Array.from(tile.anchor.querySelectorAll('*'))) {
      const htmlEl = el as HTMLElement;
      overflow = Math.max(overflow, htmlEl.scrollHeight - htmlEl.clientHeight);
    }
    if (overflow > 0) {
      bodyEl.style.height = `${bodyEl.offsetHeight + overflow}px`;
    }
  });
}
