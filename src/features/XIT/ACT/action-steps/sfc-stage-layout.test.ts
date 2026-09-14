import { describe, expect, it } from 'vitest';
import {
  ACT_PANE_MIN_WIDTH,
  SFC_PANE_MIN_WIDTH,
  SFC_STAGE_MIN_HEIGHT,
  sfcStageWindowSize,
} from './sfc-stage-layout';

describe('sfcStageWindowSize', () => {
  // Height requested by the owner after live testing.
  it('uses the 670px SFC-stage height minimum', () => {
    expect(SFC_STAGE_MIN_HEIGHT).toBe(670);
  });

  it('keeps the ACT pane at its measured width and grows the window for SFC', () => {
    const layout = sfcStageWindowSize(475, 950, 700);
    expect(layout.actWidth).toBe(475);
    expect(layout.sfcWidth).toBe(SFC_PANE_MIN_WIDTH);
    expect(layout.width).toBe(475 + SFC_PANE_MIN_WIDTH);
    expect(layout.width).toBeGreaterThan(950);
  });

  it('leaves the window alone when SFC already has its width', () => {
    const layout = sfcStageWindowSize(475, 1200, 700);
    expect(layout.actWidth).toBe(475);
    expect(layout.sfcWidth).toBe(1200 - 475);
    expect(layout.width).toBe(1200);
  });

  it('never shrinks the window', () => {
    for (const [act, width] of [
      [475, 950],
      [320, 840],
      [900, 1000],
      [200, 700],
    ]) {
      expect(sfcStageWindowSize(act, width, 700).width).toBeGreaterThanOrEqual(width);
    }
  });

  it('floors a pathologically narrow ACT pane', () => {
    const layout = sfcStageWindowSize(80, 700, 700);
    expect(layout.actWidth).toBe(ACT_PANE_MIN_WIDTH);
  });

  it('grows a short window to the height minimum but keeps a taller one', () => {
    expect(sfcStageWindowSize(475, 950, 300).height).toBe(SFC_STAGE_MIN_HEIGHT);
    expect(sfcStageWindowSize(475, 950, 900).height).toBe(900);
  });

  it('treats NaN measurements as zero', () => {
    const layout = sfcStageWindowSize(Number.NaN, Number.NaN, Number.NaN);
    expect(layout.actWidth).toBe(ACT_PANE_MIN_WIDTH);
    expect(layout.sfcWidth).toBe(SFC_PANE_MIN_WIDTH);
    expect(layout.height).toBe(SFC_STAGE_MIN_HEIGHT);
  });
});
