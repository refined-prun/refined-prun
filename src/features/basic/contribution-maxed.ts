import { clickElement } from '@src/util';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.Contribution.contribute), async contribute => {
    const table = contribute.previousElementSibling;
    if (!table) {
      return;
    }
    subscribe($$(table, 'rc-slider'), async slider => {
      if (slider.classList.contains('rc-slider-disabled')) {
        return;
      }
      const mark = await $(slider, 'rc-slider-mark');
      await clickElement(mark.lastElementChild as HTMLElement);
    });
  });
}

function init() {
  tiles.observe(['COGCU', 'POPID'], onTileReady);
}

features.add(
  import.meta.url,
  init,
  'Automatically maxes the contribution sliders in CoGC and population upkeep tiles.',
);
