import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { computed } from 'vue';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { formatEta } from '@src/utils/format';
import { timestampEachSecond } from '@src/utils/dayjs';
import { createReactiveDiv } from '@src/utils/reactive-element';
import { keepLast } from '@src/utils/keep-last';
import { $$, _$ } from '@src/utils/select-dom';
import { subscribe } from '@src/utils/subscribe-async-generator';

function onTileReady(tile: PrunTile) {
  if (!tile.parameter) {
    return;
  }

  subscribe($$(tile.frame, PrunCss.OrderSlot.container), x => onOrderSlotReady(x, tile.parameter!));
}

async function onOrderSlotReady(slot: HTMLElement, siteId: string) {
  const orderId = refPrunId(slot);
  const completion = computed(() => {
    const site = sitesStore.getById(siteId);
    const lines = productionStore.getBySiteId(site?.siteId) ?? [];
    for (const line of lines) {
      for (const order of line.orders) {
        if (order.id === orderId.value) {
          return calcCompletionDate(line, order);
        }
      }
    }
    return undefined;
  });
  const eta = computed(() => {
    if (!completion.value) {
      return undefined;
    }

    return `(${formatEta(timestampEachSecond.value, completion.value)})`;
  });
  const div = createReactiveDiv(slot, eta);
  keepLast(slot, () => _$(slot, PrunCss.OrderSlot.info), div);
}

function calcCompletionDate(line: PrunApi.ProductionLine, order: PrunApi.ProductionOrder) {
  if (!order.duration) {
    return undefined;
  }

  if (order.completion) {
    return order.completion.timestamp;
  }

  const capacity = line.capacity;
  if (capacity === 0) {
    return undefined;
  }
  const queue: number[] = [];

  for (const lineOrder of line.orders) {
    if (!lineOrder.duration) {
      return undefined;
    }
    if (lineOrder.completion) {
      // Order has started
      queue.push(lineOrder.completion.timestamp);
    } else if (queue.length < capacity) {
      // Order has not started but there's capacity to start it
      queue.push(Date.now() + lineOrder.duration.millis);
    } else {
      // Order has not started
      queue.push(queue.shift()! + lineOrder.duration.millis);
    }
    if (lineOrder === order) {
      return queue.pop();
    }
  }

  return undefined;
}

export function init() {
  tiles.observe('PROD', onTileReady);
}

void features.add({
  id: 'prod-order-eta',
  init,
});
