import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { formatEta } from '@src/utils/format';
import { timestampEachMinute } from '@src/utils/dayjs';
import { createReactiveDiv } from '@src/utils/reactive-element';
import { keepLast } from '@src/utils/keep-last';
import { calcCompletionDate } from '@src/core/production-line';

function onTileReady(tile: PrunTile) {
  if (!tile.parameter) {
    return;
  }

  subscribe($$(tile.anchor, C.OrderSlot.container), x => onOrderSlotReady(x, tile.parameter!));
}

function onOrderSlotReady(slot: HTMLElement, siteId: string) {
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
    return completion.value !== undefined
      ? `(${formatEta(timestampEachMinute.value, completion.value)})`
      : undefined;
  });
  const div = createReactiveDiv(slot, eta);
  keepLast(slot, () => _$(slot, C.OrderSlot.info), div);
}

function init() {
  tiles.observe('PROD', onTileReady);
}

features.add(import.meta.url, init, 'PROD: Adds a finish ETA label to orders.');
