import { clickElement } from '@src/util';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'table'), table => {
    const sliders = _$$(table, 'rc-slider');
    if (sliders.length === 0) {
      return;
    }
    for (const slider of sliders) {
      if (slider.classList.contains('rc-slider-disabled')) {
        continue;
      }
      $(slider, 'rc-slider-mark').then(x => clickElement(x.lastElementChild as HTMLElement));
    }
  });
}

function init() {
  tiles.observe(['COGCU', 'POPID'], onTileReady);
}

features.add(
  import.meta.url,
  init,
  'COGCU, POPID: Automatically maxes the contribution sliders in CoGC and population upkeep tiles.',
);
