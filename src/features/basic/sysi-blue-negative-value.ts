import $style from './sysi-blue-negative-value.module.css';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ColoredValue.negative), negative => {
    if (negative.innerText?.includes('▼')) {
      negative.classList.add($style.lowValue);
    }
  });
}

function init() {
  tiles.observe('SYSI', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'SYSI: Makes lower negative planet values blue instead of red.',
);
