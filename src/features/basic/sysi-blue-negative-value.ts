import $style from './sysi-blue-negative-value.module.css';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ColoredValue.negative), value => {
    if (value.innerText?.includes('▼')) {
      value.classList.add($style.lowValue);
    }
  });
}

function init() {
  applyCssRule(`.${C.ColoredValue.negative}.${$style.lowValue}`, $style.lowValue);
  tiles.observe('SYSI', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'SYSI: Makes lower negative planet values blue instead of red.',
);
