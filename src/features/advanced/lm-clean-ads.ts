import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { localAdsStore } from '@src/infrastructure/prun-api/data/local-ads';
import { extractPlanetName } from '@src/util';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.CommodityAd.container), async container => {
    const text = await $(container, C.CommodityAd.text);
    const id = getPrunId(container);
    const ad = localAdsStore.getById(id);
    if (!ad) {
      return;
    }

    const type = ad.type;
    const quantity = ad.quantity;

    if (type === 'COMMODITY_SHIPPING') {
      // Shorten planet names
      for (const link of _$$(text, C.Link.link)) {
        link.textContent = extractPlanetName(link.textContent);
      }
    }
    if ((type === 'COMMODITY_BUYING' || type === 'COMMODITY_SELLING') && quantity) {
      const amount = quantity.amount;
      text.childNodes[1].textContent = ` ${amount} @ `;
    }

    for (const node of Array.from(text.childNodes)) {
      if (!node.textContent) {
        continue;
      }

      if (node.textContent.endsWith('.00')) {
        node.textContent = node.textContent.replace('.00', '');
      }

      if (node.textContent.endsWith(',00')) {
        node.textContent = node.textContent.replace(',00', '');
      }
      node.textContent = node.textContent
        .replace(' for ', '')
        .replace('delivery', '')
        .replace('collection', '')
        .replace(' within ', ' in ')
        .replace('for delivery within', 'in');
      node.textContent = node.textContent.replace(/(\d+)\s+days*/i, '$1d');
    }
    cleanContractType(text, ad);
  });
}

function cleanContractType(text: HTMLElement, ad: PrunApi.LocalAd) {
  if (!text.firstChild) {
    return;
  }
  switch (ad.type) {
    case 'COMMODITY_SHIPPING':
      text.firstChild.textContent = '';
      break;
    case 'COMMODITY_BUYING':
      text.firstChild.textContent = 'BUY';
      break;
    case 'COMMODITY_SELLING':
      text.firstChild.textContent = 'SELL';
      break;
  }
}

function init() {
  tiles.observe('LM', onTileReady);
}

features.add(import.meta.url, init, 'LM: Hides redundant information from ads.');
