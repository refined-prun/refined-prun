import GripCell from '@src/components/grip/GripCell.vue';
import GripHeaderCell from '@src/components/grip/GripHeaderCell.vue';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import { grip } from '@src/components/grip';
import { useDraggable } from 'vue-draggable-plus';
import { onNodeDisconnected } from '@src/utils/on-node-disconnected';
import { oneMicrotask } from '@src/utils/one-microtask';
import { userData } from '@src/store/user-data';

const exchanges: UserData.Exchange[] = ['AI1', 'CI1', 'CI2', 'IC1', 'NC1', 'NC2'];

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'table'), table => {
    subscribe($$(table, 'thead'), async thead => {
      const headerRow = await $(thead, 'tr');
      createFragmentApp(GripHeaderCell).prependTo(headerRow);
    });

    subscribe($$(table, 'tbody'), tbody => {
      setupDragAndDrop(tbody);
      watchEffectWhileNodeAlive(tbody, () => reorderTable(tbody));
    });
  });
}

function setupDragAndDrop(tbody: HTMLTableSectionElement) {
  const scheduleReorder = oneMicrotask(() => reorderTable(tbody));
  subscribe($$(tbody, 'tr'), row => {
    if (row.parentElement !== tbody || row.dataset.gripAdded) {
      return;
    }
    row.dataset.gripAdded = 'true';
    createFragmentApp(GripCell).prependTo(row);
    scheduleReorder();
  });

  const draggable = useDraggable(tbody, {
    ...grip.draggable,
    immediate: false,
    draggable: '>tr',
    onEnd(event) {
      grip.draggable.onEnd?.(event);
      saveOrder(tbody);
    },
  });
  draggable.start();
  onNodeDisconnected(tbody, draggable.destroy);
}

function getExchange(row: HTMLTableRowElement) {
  for (const cell of _$$(row, 'td')) {
    const text = cell.textContent?.trim();
    if (!text) {
      continue;
    }
    const match = exchanges.find(ex => text.startsWith(ex));
    if (match) {
      return match;
    }
  }
  return undefined;
}

function reorderTable(tbody: Element) {
  const order = userData.settings.cxmOrder;
  if (order.length === 0) {
    return;
  }

  const rows = _$$(tbody, 'tr');

  const rank = (row: HTMLTableRowElement) => {
    const exchange = getExchange(row);
    const index = exchange === undefined ? -1 : order.indexOf(exchange);
    return index === -1 ? 999 : index;
  };
  rows.sort((a, b) => rank(a) - rank(b));

  for (const row of rows) {
    tbody.appendChild(row);
  }
}

function saveOrder(tbody: Element) {
  const newOrder = _$$(tbody, 'tr')
    .map(getExchange)
    .filter(x => x !== undefined);
  if (newOrder.length === 0) {
    return;
  }
  userData.settings.cxmOrder = [
    ...newOrder,
    ...userData.settings.cxmOrder.filter(x => !newOrder.includes(x)),
  ];
}

function init() {
  tiles.observe('CXM', onTileReady);
}

features.add(import.meta.url, init, 'CXM: Adds drag-and-drop to reorder exchanges.');
