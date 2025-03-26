import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { formatEta } from '@src/utils/format';
import { timestampEachMinute } from '@src/utils/dayjs';
import { createReactiveDiv } from '@src/utils/reactive-element';
import { keepLast } from '@src/utils/keep-last';
import $style from './prodq-order-eta.module.css';
import { calcCompletionDate } from '@src/core/production-line';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ProductionQueue.table), table => {
    subscribe($$(table, 'tr'), order => {
      if (_$(order, 'th')) {
        return;
      }
      onOrderSlotReady(order.children[5] as HTMLElement, order, tile.parameter!);
    });
  });
}

function onOrderSlotReady(slot: HTMLElement, order: HTMLElement, siteId: string) {
  const orderId = refPrunId(order);
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

function init() {
  applyCssRule('PRODQ', `.${C.ProductionQueue.table}`, $style.table);
  tiles.observe('PRODQ', onTileReady);
}

features.add(import.meta.url, init, 'PRODQ: Adds a finish ETA label to orders.');
