import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { sumBy } from '@src/utils/sum-by';
import { percent2 } from '@src/utils/format';
import descendantPresent from '@src/utils/descendant-present';
import {
  observeDescendantListChanged,
  observeReadyElementsByTagName,
} from '@src/utils/mutation-observer';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { computed, watch } from 'vue';
import onElementDisconnected from '@src/utils/on-element-disconnected';

async function onTileReady(tile: PrunTile) {
  if (!tile.parameter) {
    return;
  }
  const table = await descendantPresent(tile.frame, PrunCss.ProductionQueue.table);
  observeReadyElementsByTagName('tr', {
    baseElement: table,
    callback: x => onRowReady(x, tile.parameter!),
  });
}

function onRowReady(row: HTMLTableRowElement, lineId: string) {
  const orderId = refPrunId(row);
  const load = computed(() => {
    const line = productionStore.getById(lineId);
    const queue = line?.orders.filter(x => !x.started && x.duration);
    if (!queue) {
      return undefined;
    }
    const order = queue.find(o => o.id === orderId.value);
    if (!order) {
      return undefined;
    }

    const totalQueueDuration = sumBy(queue, x => x.duration!.millis);
    return order.duration!.millis / totalQueueDuration;
  });
  const div = document.createElement('div');
  onElementDisconnected(
    row,
    watch(
      load,
      load => {
        div.style.display = load !== undefined ? 'block' : 'none';
        div.textContent = load ? percent2(load) : null;
      },
      { immediate: true },
    ),
  );
  observeDescendantListChanged(row, () => {
    const statusColumn = row.children[6];
    if (statusColumn && statusColumn.lastChild !== div) {
      statusColumn.appendChild(div);
    }
  });
}

function init() {
  tiles.observe('PRODQ', onTileReady);
}

void features.add({
  id: 'prodq-queue-load',
  init,
});
