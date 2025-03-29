import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';
import { changeInputValue } from '@src/util';
import { fixed02 } from '@src/utils/format';
import { refAttributeValue } from '@src/utils/reactive-dom';
import { createReactiveSpan } from '@src/utils/reactive-element';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ComExPlaceOrderForm.form), async form => {
    const quantityInput = await $(form.children[7], 'input');
    const quantityValue = refAttributeValue(quantityInput, 'value');
    const priceInput = await $(form.children[8], 'input');
    const priceInputValue = refAttributeValue(priceInput, 'value');

    const priceBuy = ref('0');
    const showPriceBuy = ref(false);
    const priceSell = ref('0');
    const showPriceSell = ref(false);

    const placeholderText = computed(() => {
      if (!showPriceBuy.value && !showPriceSell.value) {
        return 'Auto';
      } else if (!showPriceBuy.value) {
        return `${priceSell.value}`;
      } else if (!showPriceSell.value) {
        return `${priceBuy.value}`;
      }
      return 'Error';
    });

    watchEffectWhileNodeAlive(form, () => {
      priceInput.placeholder = placeholderText.value;
    });

    const orderInfo = computed(() => cxobStore.getByTicker(tile.parameter!));
    const currencyCode = orderInfo.value?.currency.code ?? '';

    const effectivePriceLabel = await $(form.children[9], C.StaticInput.static);
    const featureEffectivePriceLabels = createDualLabels(
      form.children[10],
      effectivePriceLabel,
      currencyCode,
    );

    const volumeLabel = await $(form.children[10], C.StaticInput.static);
    const featureVolumeLabels = createDualLabels(form.children[10], volumeLabel, currencyCode);

    const buttonsField = form.children[12];
    const buy = await $(buttonsField, C.Button.success);
    buy.addEventListener('click', e => {
      if (priceInput.value === '') {
        changeInputValue(priceInput, priceBuy.value);
        e.stopPropagation();
        e.preventDefault();
      }
    });
    buy.addEventListener('mouseover', () => {
      if (priceInput.value === '') {
        featureEffectivePriceLabels.showSell.value = false;
        featureVolumeLabels.showSell.value = false;
        showPriceBuy.value = true;
      }
    });
    buy.addEventListener('mouseleave', () => {
      if (priceInput.value === '') {
        featureEffectivePriceLabels.showSell.value = true;
        featureVolumeLabels.showSell.value = true;
        showPriceBuy.value = false;
      }
    });

    const sell = await $(buttonsField, C.Button.danger);
    sell.addEventListener('click', e => {
      if (priceInput.value === '') {
        changeInputValue(priceInput, priceSell.value);
        e.stopPropagation();
        e.preventDefault();
      }
    });
    sell.addEventListener('mouseover', () => {
      if (priceInput.value === '') {
        featureEffectivePriceLabels.showBuy.value = false;
        featureVolumeLabels.showBuy.value = false;
        showPriceSell.value = true;
      }
    });
    sell.addEventListener('mouseleave', () => {
      if (priceInput.value === '') {
        featureEffectivePriceLabels.showBuy.value = true;
        featureVolumeLabels.showBuy.value = true;
        showPriceSell.value = false;
      }
    });

    const offers = computed(() => orderInfo.value?.sellingOrders ?? []);
    const requests = computed(() => orderInfo.value?.buyingOrders ?? []);

    watchEffectWhileNodeAlive(form, () => {
      if (priceInputValue.value !== '') {
        featureEffectivePriceLabels.showBuy.value = false;
        featureEffectivePriceLabels.showSell.value = false;
        featureVolumeLabels.showBuy.value = false;
        featureVolumeLabels.showSell.value = false;
        return;
      }
      if (quantityValue.value === '0' || quantityValue.value === '') {
        featureEffectivePriceLabels.buyValue.value = 0;
        featureEffectivePriceLabels.sellValue.value = 0;
        featureVolumeLabels.buyValue.value = 0;
        featureVolumeLabels.sellValue.value = 0;
        return;
      }

      featureEffectivePriceLabels.showBuy.value = true;
      featureEffectivePriceLabels.showSell.value = true;
      featureVolumeLabels.showBuy.value = true;
      featureVolumeLabels.showSell.value = true;

      const quantityInputRaw = quantityValue.value;
      const quantityNeeded = Number(quantityInputRaw);
      if (isNaN(quantityNeeded)) {
        return;
      }

      const [buyPriceLimit, buyEffectivePrice, buyVolumeAccum] = getInfoFromOrderType(
        offers.value,
        quantityNeeded,
      );

      const [sellPriceLimit, sellEffectivePrice, sellVolumeAccum] = getInfoFromOrderType(
        requests.value,
        quantityNeeded,
      );

      priceBuy.value = `${fixed02(buyPriceLimit)}`;
      priceSell.value = `${fixed02(sellPriceLimit)}`;

      featureEffectivePriceLabels.buyValue.value = buyEffectivePrice;
      featureEffectivePriceLabels.sellValue.value = sellEffectivePrice;
      featureVolumeLabels.buyValue.value = buyVolumeAccum;
      featureVolumeLabels.sellValue.value = sellVolumeAccum;
    });
  });
}

function createDualLabels(element: Element, container: HTMLElement, currencyUnit: string) {
  const [buyValue, sellValue] = [ref(0), ref(0)];
  const [showBuy, showSell] = [ref(true), ref(true)];
  const divText = computed(() => {
    if (showBuy.value && showSell.value) {
      return `${fixed02(buyValue.value)} ${currencyUnit} / ${fixed02(sellValue.value)} ${currencyUnit}`;
    } else if (!showBuy.value && !showSell.value) {
      return '';
    } else if (!showBuy.value) {
      return `${fixed02(sellValue.value)} ${currencyUnit}`;
    } else if (!showSell.value) {
      return `${fixed02(buyValue.value)} ${currencyUnit}`;
    }
    return 'Error';
  });
  const div = createReactiveSpan(element, divText);
  container.prepend(div);

  return { buyValue: buyValue, sellValue: sellValue, showBuy: showBuy, showSell: showSell };
}

function getInfoFromOrderType(orders: PrunApi.CXBrokerOrder[], quantityNeeded: number) {
  let quantityCounted = 0;
  let priceLimit = 0;
  let effectivePrice = 0;
  let volumeAccum = 0;
  for (let i = 0; i < orders.length; i++) {
    const offerAmt = orders[i].amount;
    if (!offerAmt) {
      return [0, 0, 0];
    }
    const offerPrice = orders[i].limit!.amount;
    if (offerAmt >= quantityNeeded - quantityCounted) {
      priceLimit = offerPrice;
      volumeAccum += (quantityNeeded - quantityCounted) * offerPrice;
      effectivePrice = volumeAccum / quantityNeeded;
      return [priceLimit, effectivePrice, volumeAccum];
    }
    quantityCounted += offerAmt;
    volumeAccum += offerAmt * offerPrice;
  }
  return [0, 0, 0];
}

function init() {
  tiles.observe('CXPO', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'CXPO: Leave "Price Limit" field empty for automatic calculation.',
);
