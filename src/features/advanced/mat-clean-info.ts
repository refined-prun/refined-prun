import css from '@src/utils/css-utils.module.css';
import { PrunI18N } from '@src/infrastructure/prun-ui/i18n';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.FormComponent.containerPassive), async container => {
    const label = await $(container, 'label');
    hideField(container, label, 'MaterialInformation.ticker');
    hideField(container, label, 'MaterialInformation.resource');
  });
}

function hideField(container: HTMLElement, label: HTMLElement, localizedKey: string) {
  const localizedValue = PrunI18N[localizedKey]?.[0]?.value;
  if (label?.textContent === localizedValue) {
    container.classList.add(css.hidden);
  }
}

function init() {
  tiles.observe('MAT', onTileReady);
}

features.add(import.meta.url, init, 'MAT: Hides "Ticker" and "Natural resource" fields.');
