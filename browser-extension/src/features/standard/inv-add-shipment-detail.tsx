import buffers from '@src/infrastructure/prun-ui/prun-buffers';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { _$ } from '@src/utils/get-element-by-class-name';
import { refAttributeValue } from '@src/utils/reactive-dom';
import { computed, reactive } from 'vue';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import { widgetAppend } from '@src/utils/vue-mount';
import ColoredIconDetail from '@src/components/ColoredIconDetail.vue';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';

async function onBufferCreated(buffer: PrunBuffer) {
  observeReadyElementsByClassName(PrunCss.ColoredIcon.container, {
    baseElement: buffer.frame,
    callback: element => {
      const container = _$(PrunCss.ColoredIcon.labelContainer, element);
      if (!container) {
        return;
      }

      const attribute = refAttributeValue(element, 'title');
      const detail = computed(() => {
        const regex = /Shipment\s+#([a-zA-Z0-9]+)/;
        const match = attribute.value?.match(regex);

        if (!match) {
          return undefined;
        }

        const shipmentId = match[1];
        return contractsStore.getDestinationByShipmentId(shipmentId);
      });
      widgetAppend(
        container,
        ColoredIconDetail,
        reactive({
          detail,
        }),
      );
    },
  });
}

export function init() {
  buffers.observe(['INV', 'SHPI'], onBufferCreated);
}

void features.add({
  id: 'inv-add-shipment-detail',
  init,
});
