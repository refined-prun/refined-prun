import { fxobStore } from '@src/infrastructure/prun-api/data/fxob';
import { fixed4 } from '@src/utils/format';
import { changeInputValue } from '@src/util';
import { refTextContent } from '@src/utils/reactive-dom';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';

function onTileReady(tile: PrunTile) {
  const broker = computed(() => fxobStore.getByTicker(tile.parameter));
  const currentPriceL = L.ForExPlaceOrderForm.label.price();
  const maximumPriceL = L.ForExPlaceOrderForm.limit.maximum();
  const minimumPriceL = L.ForExPlaceOrderForm.limit.minimum();

  subscribe($$(tile.anchor, C.ForExPlaceOrderForm.form), async form => {
    const passive = _$$(form, C.FormComponent.containerPassive);
    const currentPriceField = passive.find(x => _$(x, 'label')?.textContent === currentPriceL);

    const active = _$$(form, C.FormComponent.containerActive);
    const maximumPriceField = active.find(x => _$(x, 'label')?.textContent === maximumPriceL);
    const isBuying = maximumPriceField !== undefined;
    const minimumPriceField = active.find(x => _$(x, 'label')?.textContent === minimumPriceL);
    const priceInputField = isBuying ? maximumPriceField : minimumPriceField;

    if (!currentPriceField || !priceInputField) {
      return;
    }

    const currentPriceContainer = await $(currentPriceField, C.StaticInput.static);
    const currentPriceSpan = await $(currentPriceContainer, 'span');
    const currentPriceText = refTextContent(currentPriceSpan);
    watchEffectWhileNodeAlive(currentPriceSpan, () => {
      if (!broker.value) {
        return;
      }

      const price = getPrice(broker.value, isBuying);
      const currency = broker.value.pair.quote.code;
      const text = `${fixed4(price)} ${currency}`;
      if (currentPriceText.value !== text) {
        currentPriceSpan.textContent = text;
      }
    });

    const setPriceButton = await $(currentPriceContainer, 'button');
    const priceInput = await $(priceInputField, 'input');
    setPriceButton.addEventListener('click', e => {
      if (!broker.value) {
        return;
      }

      const price = getPrice(broker.value, isBuying);
      changeInputValue(priceInput, fixed4(price));
      e.stopPropagation();
      e.preventDefault();
    });
  });
}

function getPrice(broker: PrunApi.FXBroker, isBuying: boolean) {
  return isBuying ? getBuyPrice(broker) : getSellPrice(broker);
}

function getBuyPrice(broker: PrunApi.FXBroker) {
  const orders = broker.sellingOrders;
  if (orders.length === 0) {
    return broker.price.close.rate;
  }
  const prices = orders.map(x => x.limit.rate).toSorted();
  return prices[0];
}

function getSellPrice(broker: PrunApi.FXBroker) {
  const orders = broker.buyingOrders;
  if (orders.length === 0) {
    return broker.price.close.rate;
  }
  const prices = orders
    .map(x => x.limit.rate)
    .toSorted()
    .reverse();
  return prices[0];
}

function init() {
  tiles.observe('FXPO', onTileReady);
}

features.add(import.meta.url, init, 'FXPO: Sets the current price to the order book price.');
