import $style from './blue-negative-value.module.css';

const downClass = 'Down';

function onTileReady(tile: PrunTile) {
  console.log(tile.anchor);

  subscribe($$(tile.anchor, C.ColoredValue.negative), value => {
    if (value.innerText?.includes('▼')) {
      console.log(value);
      value.classList.add(downClass);
    }
  });
}

function init() {
  applyCssRule(`.${C.ColoredValue.negative}.${downClass}`, $style.lowValue);
  tiles.observe('SYSI', onTileReady);
}

features.add(import.meta.url, init, 'SYSI: Makes lower negative planet values blue instead of red.');
