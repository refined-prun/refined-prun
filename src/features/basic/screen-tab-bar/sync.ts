import { screensStore } from '@src/infrastructure/prun-api/data/screens';
import { userData } from '@src/store/user-data';
import removeArrayElement from '@src/utils/remove-array-element';

export function syncState() {
  const sorted = screensStore.sorted.value;
  if (!sorted) {
    return;
  }
  const order = userData.tabs.order;
  const hidden = userData.tabs.hidden;
  const tracked = new Set<string>([...order, ...hidden]);
  for (const tab of sorted) {
    if (!tracked.has(tab.id)) {
      order.push(tab.id);
    }
  }
  const existing = new Set<string>(sorted.map(x => x.id));
  for (const id of order) {
    if (!existing.has(id)) {
      removeArrayElement(order, id);
    }
  }
  for (const id of hidden) {
    if (!existing.has(id)) {
      removeArrayElement(hidden, id);
    }
  }
}
