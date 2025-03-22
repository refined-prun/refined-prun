import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { formatEta } from '@src/utils/format';
import { timestampEachMinute } from '@src/utils/dayjs';
import { createReactiveDiv } from '@src/utils/reactive-element';
import { keepLast } from '@src/utils/keep-last';
import { applyScopedCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import classes from './prodq-order-eta.module.css';
import { calcCompletionDate } from '@src/core/production-line';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ProductionQueue.table), table => {
    subscribe($$(table, 'tr'), order => {
      const orderId = refPrunId(order);
      if (!orderId.value) {
        return;
      }
      onOrderSlotReady(order.children[5] as HTMLElement, orderId, tile.parameter!);
    });
  });
}

function onOrderSlotReady(
  slot: HTMLElement,
  orderId: globalThis.Ref<string | null, string | null>,
  siteId: string,
) {
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
  applyScopedCssRule(
    'PRODQ',
    `.${C.ProductionQueue.table} thead tr th:nth-child(6)`,
    classes.thCompletion,
  );
  tiles.observe('PRODQ', onTileReady);
}

features.add(import.meta.url, init, 'PRODQ: Adds a finish ETA label to orders.');
