import RemoteShippingAd from './RemoteShippingAd';
import { getShippingAds, ShippingAd } from '@src/core/shipping/shipping-ads';
import { localAdsStore } from '@src/infrastructure/prun-api/data/local-ads';
import { stationsStore } from '@src/infrastructure/prun-api/data/stations';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { convertToPlanetNaturalId } from '@src/core/planet-natural-id';
import { observeChildListChanged } from '@src/utils/mutation-observer';

function onTileReady(tile: PrunTile) {
  const location = resolveLocation(tile.parameter!);
  if (!location) {
    return;
  }

  const ads = computed(() => {
    const byKey = new Map<string, ShippingAd>();
    for (const ad of [
      ...getShippingAds('source', location),
      ...getShippingAds('destination', location),
    ]) {
      if (ad.lm !== location) {
        byKey.set(ad.key, ad);
      }
    }
    return [...byKey.values()];
  });

  subscribe($$(tile.anchor, C.LocalMarket.list), list => {
    const renderedIds = ref<string[]>([]);
    observeChildListChanged(list, () => {
      renderedIds.value = _$$(list, C.CommodityAd.container)
        .map(x => getPrunId(x))
        .filter(x => x !== null);
    });
    const hidden = computed(() => isShippingFilteredOut(location, renderedIds.value));
    createFragmentApp(() =>
      ads.value.map(ad => h(RemoteShippingAd, { key: ad.key, ad, hidden: hidden.value })),
    ).appendTo(list);
  });
}

// The LM type filter state is not in the API data. If this LM has live shipping ads
// but none of them is on screen while other ads are, the filter hides shipping ads.
function isShippingFilteredOut(location: string, renderedIds: string[]) {
  const shipping = localAdsStore.all.value?.filter(
    x => x.type === 'COMMODITY_SHIPPING' && getEntityNaturalIdFromAddress(x.address) === location,
  );
  if (shipping === undefined || shipping.length === 0 || renderedIds.length === 0) {
    return false;
  }
  const rendered = new Set(renderedIds);
  return !shipping.some(x => rendered.has(x.id));
}

function resolveLocation(parameter: string) {
  const station =
    stationsStore.getByNaturalId(parameter.toUpperCase()) ?? stationsStore.getByName(parameter);
  if (station) {
    return getEntityNaturalIdFromAddress(station.address);
  }
  return convertToPlanetNaturalId(parameter);
}

function init() {
  tiles.observe('LM', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'LM: Shows shipping ads from other LMs that start or end at this location.',
);
