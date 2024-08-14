import buffers from '@src/prun-ui/prun-buffers';
import features from '@src/feature-registry';
import PrunCss from '../prun-ui/prun-css';
import { _$ } from '@src/utils/get-element-by-class-name';
import { refAttributeValue } from '@src/utils/reactive-dom';
import { computed, reactive } from 'vue';
import { contractsStore } from '@src/prun-api/data/contracts';
import { widgetAppend } from '@src/utils/vue-mount';
import ColoredIconDetail from '@src/components/ColoredIconDetail.vue';

async function onBufferCreated(buffer: PrunBuffer) {
  const icons = buffer.frame.getElementsByClassName(PrunCss.ColoredIcon.container);
  const seenIcons = new WeakSet<Element>();
  const observer = new MutationObserver(() => {
    for (const icon of icons) {
      if (seenIcons.has(icon)) {
        continue;
      }

      seenIcons.add(icon);
      const container = _$(PrunCss.ColoredIcon.labelContainer, icon);
      if (!container) {
        continue;
      }

      const attribute = refAttributeValue(icon, 'title');
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
    }
  });
  observer.observe(buffer.frame, { childList: true, subtree: true });
}

export function init() {
  buffers.observe(['INV', 'SHIPI'], onBufferCreated);
}

void features.add({
  id: 'inv-add-shipment-detail',
  init,
});
