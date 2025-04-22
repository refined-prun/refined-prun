import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';
import { changeInputValue } from '@src/util';
import { fixed02 } from '@src/utils/format';
import { refValue } from '@src/utils/reactive-dom';
import { createReactiveDiv } from '@src/utils/reactive-element';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ComExPlaceOrderForm.form), x => onFormReady(x, tile.parameter));
}

async function onFormReady(form: HTMLElement, parameter?: string) {
  const orderBook = computed(() => cxobStore.getByTicker(parameter));

  const quantityInput = await $(form.children[7], 'input');
  const quantityValue = refValue(quantityInput);
  const priceInfo = computed(() => {
    const quantity = Number(quantityValue.value);
    if (!isFinite(quantity) || quantity <= 0 || !orderBook.value) {
      return undefined;
    }
    return {
      buy: fillQuantity(orderBook.value.sellingOrders, quantity),
      sell: fillQuantity(orderBook.value.buyingOrders, quantity),
    };
  });

  const priceBuy = computed(() => priceInfo.value?.buy.price ?? 0);
  const priceSell = computed(() => priceInfo.value?.sell.price ?? 0);

  const priceInput = await $(form.children[8], 'input');
  const priceInputValue = refValue(priceInput);
  const showAutoValues = computed(() => priceInputValue.value === '');

  const buttonsField = form.children[12];

  const isBuyFocused = ref(false);
  const buy = await $(buttonsField, C.Button.success);
  buy.addEventListener('mouseover', () => (isBuyFocused.value = true));
  buy.addEventListener('mouseleave', () => (isBuyFocused.value = false));
  buy.addEventListener('click', e => {
    if (showAutoValues.value) {
      changeInputValue(priceInput, priceBuy.value.toString());
      e.stopPropagation();
      e.preventDefault();
    }
  });

  const isSellFocused = ref(false);
  const sell = await $(buttonsField, C.Button.danger);
  sell.addEventListener('mouseover', () => (isSellFocused.value = true));
  sell.addEventListener('mouseleave', () => (isSellFocused.value = false));
  sell.addEventListener('click', e => {
    if (showAutoValues.value) {
      changeInputValue(priceInput, priceSell.value.toString());
      e.stopPropagation();
      e.preventDefault();
    }
  });

  const placeholderText = computed(() => {
    if (isBuyFocused.value) {
      return fixed02(priceBuy.value);
    }
    if (isSellFocused.value) {
      return fixed02(priceSell.value);
    }
    return 'Auto';
  });

  watchEffectWhileNodeAlive(form, () => {
    priceInput.placeholder = placeholderText.value;
  });

  const currencyCode = orderBook.value?.currency.code ?? '';
  const showBuyValues = computed(() => showAutoValues.value && !isSellFocused.value);
  const showSellValues = computed(() => showAutoValues.value && !isBuyFocused.value);

  const effectivePriceLabel = await $(form.children[9], C.StaticInput.static);
  createDualLabels(
    effectivePriceLabel.parentElement!,
    currencyCode,
    showAutoValues,
    computed(() => (showBuyValues.value ? priceInfo.value?.buy.effectivePrice : undefined)),
    computed(() => (showSellValues.value ? priceInfo.value?.sell.effectivePrice : undefined)),
  );

  const volumeLabel = await $(form.children[10], C.StaticInput.static);
  createDualLabels(
    volumeLabel.parentElement!,
    currencyCode,
    showAutoValues,
    computed(() => (showBuyValues.value ? priceInfo.value?.buy.volume : undefined)),
    computed(() => (showSellValues.value ? priceInfo.value?.sell.volume : undefined)),
  );

  watchEffectWhileNodeAlive(form, () => {
    effectivePriceLabel.style.display = showAutoValues.value ? 'none' : '';
    volumeLabel.style.display = showAutoValues.value ? 'none' : '';
  });
}

function createDualLabels(
  container: HTMLElement,
  currencyUnit: string,
  showAutoValues: Ref<boolean>,
  buyValue: Ref<number | undefined>,
  sellValue: Ref<number | undefined>,
) {
  const text = computed(() => {
    if (!showAutoValues.value) {
      return undefined;
    }
    if (buyValue.value && sellValue.value) {
      return `${fixed02(buyValue.value)} ${currencyUnit} / ${fixed02(sellValue.value)} ${currencyUnit}`;
    }
    if (buyValue.value) {
      return `${fixed02(buyValue.value)} ${currencyUnit}`;
    }
    if (sellValue.value) {
      return `${fixed02(sellValue.value)} ${currencyUnit}`;
    }
    return '--';
  });
  const div = createReactiveDiv(container, text);
  div.classList.add(C.StaticInput.static, C.forms.static);
  container.prepend(div);
}

function fillQuantity(orders: PrunApi.CXBrokerOrder[], quantityNeeded: number) {
  const filled = {
    amount: 0,
    priceLimit: 0,
    volume: 0,
  };
  for (const order of orders) {
    // MM orders don't have the amount.
    const orderAmount = order.amount ?? Infinity;
    const remaining = quantityNeeded - filled.amount;
    const filledByOrder = Math.min(remaining, orderAmount);
    const orderPrice = order.limit.amount;
    filled.priceLimit = orderPrice;
    filled.amount += filledByOrder;
    filled.volume += filledByOrder * orderPrice;
    if (filled.amount === quantityNeeded) {
      break;
    }
  }
  const leftover = quantityNeeded - filled.amount;
  filled.volume += leftover * filled.priceLimit;
  return {
    price: filled.priceLimit,
    effectivePrice: filled.volume / quantityNeeded,
    volume: filled.volume,
  };
}

function init() {
  tiles.observe('CXPO', onTileReady);
}

features.add(import.meta.url, init, 'CXPO: Adds automatic price calculation.');
