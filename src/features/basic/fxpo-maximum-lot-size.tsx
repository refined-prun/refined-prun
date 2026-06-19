import { fxobStore } from '@src/infrastructure/prun-api/data/fxob';
import Passive from '@src/components/forms/Passive.vue';
import { ElementTag } from '@src/infrastructure/prun-ui/tagger';
import { fixed0 } from '@src/utils/format';
import PrunButton from '@src/components/PrunButton.vue';
import { changeInputValue } from '@src/util';

function onTileReady(tile: PrunTile) {
  const broker = computed(() => fxobStore.getByTicker(tile.parameter));

  subscribe($$(tile.anchor, C.ForExPlaceOrderForm.form), async form => {
    const lotsField = await $(form, ElementTag.FXPO_LOTS_FIELD);
    const priceInputField = await Promise.any([
      $(form, ElementTag.FXPO_MAXIMUM_PRICE_FIELD),
      $(form, ElementTag.FXPO_MINIMUM_PRICE_FIELD),
    ]);
    const isBuying = priceInputField.classList.contains(ElementTag.FXPO_MAXIMUM_PRICE_FIELD);

    const lotsInput = await $(lotsField, 'input');
    const priceInput = await $(priceInputField, 'input');
    const nextOrder = computed(() =>
      broker.value ? getNextOrder(broker.value, isBuying) : undefined,
    );
    const maximumLot = computed(() => {
      if (nextOrder.value === undefined) {
        return undefined;
      }
      return nextOrder.value.amount.amount / broker.value!.lotSize.amount;
    });
    const maximumLotText = computed(() =>
      maximumLot.value !== undefined ? fixed0(maximumLot.value) : '--',
    );

    const onClick = () => {
      if (nextOrder.value !== undefined) {
        changeInputValue(priceInput, fixed0(nextOrder.value.limit.rate));
        changeInputValue(lotsInput, maximumLot.value!.toFixed(0));
      }
    };

    createFragmentApp(() => (
      <Passive
        label="Maximum Lot"
        tooltipPosition="bottom"
        tooltip="Refined PrUn: Current FX implementation allows only one order to be filled at a time.
         This field allows you to set the maximum lot size for the top order in the order book.">
        <span>
          {maximumLotText.value}{' '}
          <PrunButton dark inline onClick={onClick}>
            set
          </PrunButton>
        </span>
      </Passive>
    )).before(lotsField);
  });
}

function getNextOrder(broker: PrunApi.FXBroker, isBuying: boolean) {
  const orders = isBuying ? broker.sellingOrders : broker.buyingOrders;
  if (orders.length === 0) {
    return undefined;
  }
  return orders[0];
}

function init() {
  tiles.observe('FXPO', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'FXPO: Adds a "Maximum Lot Size" field to fill the top order in the order book.',
);
