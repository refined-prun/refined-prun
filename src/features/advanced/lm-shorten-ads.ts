import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { localAdsStore } from '@src/infrastructure/prun-api/data/local-ads';
import { extractPlanetName } from '@src/util';
import { planetsStore } from '@src/infrastructure/prun-api/data/planets';

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
      cleanShipmentAd(tile, text);
    }
    if ((type === 'COMMODITY_BUYING' || type === 'COMMODITY_SELLING') && quantity) {
      const amount = quantity.amount;
      text.childNodes[1].textContent = ` ${amount} @ `;
    }

    for (const node of Array.from(text.childNodes)) {
      if (!node.textContent) {
        continue;
      }

      node.textContent = node.textContent.replace('.00', '');
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

function cleanShipmentAd(tile: PrunTile, ad: HTMLElement) {
  // Shorten planet names
  const parameter = tile.parameter?.toUpperCase();
  for (const link of $$(ad, C.Link.link)) {
    const planetName = extractPlanetName(link.textContent);
    const planet = planetsStore.find(planetName);
    if (parameter === planetName?.toUpperCase() || parameter === planet?.naturalId.toUpperCase()) {
      // Hide 'from' and 'to' links from shipment ads on the same planet/station.
      link.previousSibling!.textContent = '';
      link.style.display = 'none';
      continue;
    }
    link.textContent = planetName;
  }
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

features.add(import.meta.url, init, 'LM: Hides redundant text from ads.');
