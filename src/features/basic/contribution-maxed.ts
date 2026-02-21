import { clickElement } from '@src/util';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'table'), table => {
    subscribe($$(table, 'rc-slider'), slider => {
      if (slider.classList.contains('rc-slider-disabled')) {
        return;
      }
      $(slider, 'rc-slider-mark').then(x => clickElement(x.lastElementChild as HTMLElement));
    });
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
