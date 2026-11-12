import css from '@src/utils/css-utils.module.css';
import $style from './lm-remote-shipping-ads.module.css';
import { ShippingAd } from '@src/core/shipping/shipping-ads';
import {
  getFullAddressName,
  getLocationLineFromAddress,
  getSystemLineFromAddress,
  isStationLine,
} from '@src/infrastructure/prun-api/data/addresses';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { fixed2 } from '@src/utils/format';

// Vanilla format: `Hortus Station (Hortus)`, `Krupp - Berthier (OF-375b)`.
function getLocationLabel(address: PrunApi.Address | undefined, fallback: string) {
  const location = getLocationLineFromAddress(address);
  if (!location) {
    return fallback;
  }
  if (isStationLine(location)) {
    const system = getSystemLineFromAddress(address)?.entity.name;
    return system ? `${location.entity.name} (${system})` : location.entity.name;
  }
  return `${getFullAddressName(address) ?? location.entity.name} (${location.entity.naturalId})`;
}

function getRatingClass(rating: string) {
  const key = (rating === 'PENDING' ? 'p' : rating.toLowerCase()) as keyof typeof C.RatingIcon;
  return C.RatingIcon[key] ?? C.RatingIcon.u;
}

// Mirrors the vanilla ad DOM, text node by text node, so the other LM features apply to it.
export default defineComponent({
  props: {
    ad: { type: Object as PropType<ShippingAd>, required: true },
    hidden: { type: Boolean, required: true },
  },
  setup(props) {
    return () => {
      const ad = props.ad;
      const local = ad.localAd;
      const rating = ad.minimumRating;
      return h(
        'div',
        {
          class: [C.LocalMarket.item, $style.item, props.hidden && css.hidden],
          onClick: () => void showBuffer(`LMA ${ad.key}`),
        },
        h('div', { class: C.CommodityAd.container, 'data-prun-id': local.id }, [
          h(
            'div',
            {
              class: [
                C.RatingIcon.container,
                C.RatingIcon.small,
                C.RatingIcon.rating,
                C.type.typeLarge,
                C.fonts.fontSmallHeaders,
                getRatingClass(rating),
              ],
              title: `Rating: ${rating === 'PENDING' ? 'pending' : rating}`,
            },
            rating === 'PENDING' ? 'P' : rating,
          ),
          h('div', { class: C.CommodityAd.text }, [
            L.LocalMarket.adType.shipping() ?? 'SHIPPING',
            ' ',
            fixed2(ad.weight),
            't / ',
            fixed2(ad.volume),
            'm³ @ ',
            fixed2(ad.value),
            ` ${ad.currency}`,
            ' from ',
            h('span', { class: C.Link.link }, getLocationLabel(local.origin, ad.origin)),
            ' to ',
            h('span', { class: C.Link.link }, getLocationLabel(local.destination, ad.destination)),
            ' for delivery within ',
            L.CommodityShippingAd.text.collection({ advice: local.advice }) ??
              `${local.advice} days`,
            ad.fromFio
              ? h(
                  'span',
                  {
                    class: $style.fio,
                    'data-tooltip': 'Data from FIO, it can be out of date.',
                  },
                  ' · FIO',
                )
              : null,
          ]),
        ]),
      );
    };
  },
});
