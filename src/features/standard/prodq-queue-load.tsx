import { sumBy } from '@src/utils/sum-by';
import { percent2 } from '@src/utils/format';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { createReactiveDiv } from '@src/utils/reactive-element';
import { keepLast } from '@src/utils/keep-last';

function onTileReady(tile: PrunTile) {
  const parameter = tile.parameter;
  if (!parameter) {
    return;
  }
  subscribe($$(tile.anchor, PrunCss.ProductionQueue.table), table => {
    subscribe($$(table, 'tr'), x => onRowReady(x, parameter));
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
    return percent2(order.duration!.millis / totalQueueDuration);
  });
  const div = createReactiveDiv(row, load);
  keepLast(row, () => row.children[6], div);
}

function init() {
  tiles.observe('PRODQ', onTileReady);
}

features.add({
  id: 'prodq-queue-load',
  description: 'PROD!: Adds a daily load percentage label to queued orders.',
  init,
});
