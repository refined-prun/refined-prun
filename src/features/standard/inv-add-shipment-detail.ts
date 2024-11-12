import { refAttributeValue } from '@src/utils/reactive-dom';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import ColoredIconDetail from '@src/components/ColoredIconDetail.vue';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ColoredIcon.container), async container => {
    const label = await $(container, C.ColoredIcon.labelContainer);
    const attribute = refAttributeValue(container, 'title');
    const detail = computed(() => {
      const regex = /#([a-zA-Z0-9]+)/;
      const match = attribute.value?.match(regex);

      if (!match) {
        return undefined;
      }

      const shipmentId = match[1];
      return contractsStore.getDestinationByShipmentId(shipmentId);
    });
    createFragmentApp(
      ColoredIconDetail,
      reactive({
        detail,
      }),
    ).appendTo(label);
  });
}

function init() {
  tiles.observe(['INV', 'SHPI'], onTileReady);
}

features.add(
  import.meta.url,
  init,
  'INV/SHPI: Adds a shipment destination detail to the SHPT items.',
);
