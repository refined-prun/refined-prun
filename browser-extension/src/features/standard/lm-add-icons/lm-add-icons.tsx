import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';
import tiles from '@src/infrastructure/prun-ui/tiles';
import { _$, _$$ } from '@src/utils/get-element-by-class-name';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import LMMaterialIcon from './LMMaterialIcon.vue';
import LMShipmentIcon from './LMShipmentIcon.vue';

function onTileReady(tile: PrunTile) {
  observeReadyElementsByClassName(PrunCss.CommodityAd.container, {
    baseElement: tile.frame,
    callback: onContainerReady,
  });
}

function onContainerReady(container: HTMLDivElement) {
  const adText = _$(PrunCss.CommodityAd.text, container);
  if (!adText) {
    return;
  }
  const type = adText.firstChild?.nodeValue;
  if (type === 'SHIPPING') {
    processShipment(container, adText);
  }
  if (type === 'BUYING' || type === 'SELLING') {
    processTrade(container, adText);
  }
}

function processShipment(container: Element, adText: Element) {
  const link = _$$(PrunCss.Link.link, adText)[1] as HTMLDivElement;
  if (!link) {
    return;
  }

  createFragmentApp(LMShipmentIcon).before(container.firstElementChild!);
}

function processTrade(container: Element, adText: Element) {
  const amountNode = adText.childNodes[1];
  const amountText = amountNode.textContent;
  const regex = /(\d+)\s+[\w-\s]+\((\w+)\)/;

  const ticker = amountText?.match(regex)?.[2];
  const amount = (() => {
    const match = amountText?.match(regex)?.[1];
    if (!match) {
      return undefined;
    }
    const amount = Number.parseFloat(match);
    return isFinite(amount) ? amount : undefined;
  })();

  amountNode.textContent = ` ${amount} @ `;

  createFragmentApp(LMMaterialIcon, { ticker }).before(container.firstElementChild!);
}

export function init() {
  tiles.observe('LM', onTileReady);
}

void features.add({
  id: 'lm-add-icons',
  init,
});
