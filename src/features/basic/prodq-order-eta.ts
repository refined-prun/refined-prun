import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { formatEta } from '@src/utils/format';
import { timestampEachMinute } from '@src/utils/dayjs';
import { createReactiveDiv } from '@src/utils/reactive-element';
import { keepLast } from '@src/utils/keep-last';
import { applyScopedCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import classes from './prodq-order-eta copy.module.css';

function onTileReady(tile: PrunTile) {
  if (!tile.parameter) {
    return;
  }

  subscribe($$(tile.anchor, C.ProductionQueue.table), table => {
    subscribe($$(table, 'tr'), order => {
      if (_$(order, 'th')) {
        return;
      }
      onOrderSlotReady(order.children[5] as HTMLElement, order, tile.parameter!);
    });
  });
}

function onOrderSlotReady(slot: HTMLElement, prunIdSlot: HTMLElement, siteId: string) {
  const orderId = refPrunId(prunIdSlot);
  const completion = computed(() => {
    const line = productionStore.getById(siteId);
    for (const order of line?.orders ?? []) {
      if (order.id === orderId.value) {
        return calcCompletionDate(line!, order);
      }
    }
    return undefined;
  });
  const eta = computed(() => {
    if (!completion.value) {
      return undefined;
    }

    return `(${formatEta(timestampEachMinute.value, completion.value)})`;
  });
  const div = createReactiveDiv(slot, eta);
  keepLast(slot, () => slot, div);
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
      queue.sort();
      queue.push(queue.shift()! + lineOrder.duration.millis);
    }
    if (lineOrder === order) {
      return queue.pop();
    }
  }

  return undefined;
}

function init() {
  applyScopedCssRule(
    'PRODQ',
    `.${C.ProductionQueue.table} thead tr th:nth-child(6)`,
    classes.thCompletion,
  );
  tiles.observe('PRODQ', onTileReady);
}

features.add(import.meta.url, init, 'PRODQ: Adds a finish ETA label to orders.');
