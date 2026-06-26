import { fxobStore } from '@src/infrastructure/prun-api/data/fxob';
import { fixed4 } from '@src/utils/format';
import { changeInputValue } from '@src/util';
import { refTextContent } from '@src/utils/reactive-dom';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import { ElementTag } from '@src/infrastructure/prun-ui/tagger';

function onTileReady(tile: PrunTile) {
  const broker = computed(() => fxobStore.getByTicker(tile.parameter));

  subscribe($$(tile.anchor, C.ForExPlaceOrderForm.form), async form => {
    const currentPriceField = await $(form, ElementTag.FXPO_CURRENT_PRICE_FIELD);
    const priceInputField = await Promise.any([
      $(form, ElementTag.FXPO_MAXIMUM_PRICE_FIELD),
      $(form, ElementTag.FXPO_MINIMUM_PRICE_FIELD),
    ]);
    const isBuying = priceInputField.classList.contains(ElementTag.FXPO_MAXIMUM_PRICE_FIELD);

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
  const orders = isBuying ? broker.sellingOrders : broker.buyingOrders;
  if (orders.length === 0) {
    return broker.price.close.rate;
  }
  return orders[0].limit.rate;
}

function init() {
  tiles.observe('FXPO', onTileReady);
}

features.add(import.meta.url, init, 'FXPO: Sets the current price to the order book price.');
