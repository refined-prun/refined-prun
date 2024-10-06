import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { refAttributeValue } from '@src/utils/reactive-dom';
import { computed, reactive } from 'vue';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import ColoredIconDetail from '@src/components/ColoredIconDetail.vue';
import { $, $$ } from '@src/utils/select-dom';
import { subscribe } from '@src/utils/subscribe-async-generator';

async function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, PrunCss.ColoredIcon.container), async container => {
    const label = await $(container, PrunCss.ColoredIcon.labelContainer);
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

export function init() {
  tiles.observe(['INV', 'SHPI'], onTileReady);
}

void features.add({
  id: 'inv-add-shipment-detail',
  init,
});
