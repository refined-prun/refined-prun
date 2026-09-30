import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { localAdsStore } from '@src/infrastructure/prun-api/data/local-ads';
import { extractPlanetName } from '@src/util';
import { applyLocalizationPatch } from '@src/infrastructure/prun-ui/i18n';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.CommodityAd.container), async container => {
    const text = await $(container, C.CommodityAd.text);
    const id = getPrunId(container);
    const ad = localAdsStore.getById(id);
    if (!ad) {
      return;
    }

    const type = ad.type;

    if (type === 'COMMODITY_SHIPPING') {
      // Shorten planet names
      const links = _$$(text, C.Link.link);
      if (links.length === 2) {
        links[0].textContent = extractPlanetName(links[0].textContent);
        links[1].textContent = extractPlanetName(links[1].textContent);
      }
    }

    // We cannot use localization patching for this because the numbers are passed in as strings rather than numbers, limiting our formatting options.
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
    }
  });
}

function init() {
  tiles.observe('LM', onTileReady);
  applyLocalizationPatch(L.CommodityShippingAd.text.perspectiveSender, {
    en: () => '{action} {amount} {commodity} @ {price} {origin} → {destination} in {adviceTime}',
    ja: () => '{action} {amount} {commodity} @ {price} {origin} → {destination} {adviceTime}以内',
  });
  applyLocalizationPatch(L.CommodityShippingAd.text.perspectiveShipper, {
    en: () => '{action} {weight}t / {volume}m³ @ {price} {origin} → {destination} in {adviceTime}',
    ja: () => '{action} {weight}t / {volume}m³ @ {price} {origin} → {destination} {adviceTime}以内',
  });
  applyLocalizationPatch(L.CommodityAd.text, {
    en: () => '{action} {amount} {commodity} ({ticker}) @ {price} in {adviceTime}',
    ja: () => '{action} {amount} {commodity} ({ticker}) @ {price} {adviceTime}以内',
  });
  applyLocalizationPatch(L.CommodityAd.text.advice, {
    en: () => '{advice, number}d',
    ja: () => '{advice, number}日',
  });
  applyLocalizationPatch(L.CommodityShippingAd.text.collection, {
    en: () => '{advice, number}d',
    ja: () => '{advice, number}日',
  });
  applyLocalizationPatch(L.LocalMarket.adType.shipping, {
    default: () => '',
  });
  applyLocalizationPatch(L.LocalMarket.adType.buying, {
    en: () => 'BUY',
    ja: () => '買',
  });
  applyLocalizationPatch(L.LocalMarket.adType.selling, {
    en: () => 'SELL',
    ja: () => '売',
  });
}

features.add(import.meta.url, init, 'LM: Hides redundant information from ads.');
