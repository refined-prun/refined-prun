// On the first SFC, preserve ACT's width and grow the window for SFC as needed.
// Never shrink a larger window set by the player.
export const ACT_PANE_MIN_WIDTH = 320;
export const SFC_PANE_MIN_WIDTH = 520;
export const SFC_STAGE_MIN_HEIGHT = 670;

export function sfcStageWindowSize(
  actPaneWidth: number,
  currentWidth: number,
  currentHeight: number,
) {
  const actWidth = Math.max(finiteOrZero(actPaneWidth), ACT_PANE_MIN_WIDTH);
  // Give SFC the remaining width, growing the window if its minimum needs more.
  const sfcWidth = Math.max(finiteOrZero(currentWidth) - actWidth, SFC_PANE_MIN_WIDTH);
  const height = Math.max(finiteOrZero(currentHeight), SFC_STAGE_MIN_HEIGHT);
  return {
    actWidth,
    sfcWidth,
    width: actWidth + sfcWidth,
    height,
  };
}

function finiteOrZero(n: number) {
  return Number.isFinite(n) ? n : 0;
}
