import css from '@src/utils/css-utils.module.css';
import { L } from '@src/infrastructure/prun-ui/i18n';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.FormComponent.containerPassive), async container => {
    const label = await $(container, 'label');
    if (
      label?.textContent === L.MaterialInformation.ticker.format() ||
      label?.textContent === L.MaterialInformation.resource.format()
    ) {
      container.classList.add(css.hidden);
      return;
    }
  });
}

function init() {
  tiles.observe('MAT', onTileReady);
}

features.add(import.meta.url, init, 'MAT: Hides "Ticker" and "Natural resource" fields.');
