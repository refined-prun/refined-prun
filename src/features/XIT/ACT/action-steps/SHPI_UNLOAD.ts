import { act } from '@src/features/XIT/ACT/act-registry';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { clickElement } from '@src/util';
import { AssertFn } from '@src/features/XIT/ACT/shared-types';
import { watchWhile } from '@src/utils/watch';

interface Data {
  shipId: string;
}

export const SHPI_UNLOAD = act.addActionStep<Data>({
  type: 'SHPI_UNLOAD',
  description: data => {
    const ship = shipsStore.getById(data.shipId);
    const shipLabel = ship?.name ?? ship?.registration ?? 'unknown ship';
    return `Unload all cargo from ${shipLabel}`;
  },
  totalMaterials: data => {
    const ship = shipsStore.getById(data.shipId);
    if (!ship) {
      return {};
    }
    const store = storagesStore.getById(ship.idShipStore);
    if (!store) {
      return {};
    }
    const result: Record<string, number> = {};
    for (const item of store.items) {
      if (item.quantity) {
        result[item.quantity.material.ticker] = item.quantity.amount;
      }
    }
    return result;
  },
  execute: async ctx => {
    const { data, setStatus, requestTile, waitAct, waitActionFeedback, complete } = ctx;
    const assert: AssertFn = ctx.assert;

    const ship = shipsStore.getById(data.shipId);
    assert(ship, 'Ship not found');

    const tile = await requestTile(`SHPI ${ship.registration}`);
    if (!tile) {
      return;
    }

    // Standalone primary "unload" button below the capacity bars.
    const button = await $(tile.anchor, C.Button.primary);

    const totalQuantity = computed(() => {
      const store = storagesStore.getById(ship.idShipStore);
      if (!store) {
        return 0;
      }
      return sumBy(store.items, x => x.quantity?.amount ?? 0);
    });
    const before = totalQuantity.value;

    await waitAct(`Unload all cargo from ${ship.name ?? ship.registration}?`);
    await clickElement(button);
    await waitActionFeedback(tile);
    setStatus('Waiting for storage update...');
    await watchWhile(() => totalQuantity.value === before);

    complete();
  },
});
