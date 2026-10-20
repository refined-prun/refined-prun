import { act } from '@src/features/XIT/ACT/act-registry';
import { AssertFn } from '@src/features/XIT/ACT/shared-types';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { acceptedAds } from '@src/features/XIT/ACT/action-steps/LMA_ACCEPT';
import { pickedUpShipments } from '@src/features/XIT/ACT/action-steps/CONT_PICKUP';
import { watchUntil } from '@src/utils/watch';
import { sleep } from '@src/utils/sleep';

interface Data {
  key: string;
  shipId: string;
}

const storeUpdateTimeoutMs = 30000;
const dropTargetTimeoutMs = 5000;

export const INV_MOVE_SHIPMENT = act.addActionStep<Data>({
  type: 'INV_MOVE_SHIPMENT',
  description: data => {
    const ship = shipsStore.getById(data.shipId);
    const shipLabel = ship?.name ?? ship?.registration ?? 'unknown ship';
    return `Move shipment of ad ${data.key} to ${shipLabel}`;
  },
  execute: async ctx => {
    const {
      data,
      log,
      setStatus,
      requestTile,
      requestSecondaryTile,
      waitAct,
      complete,
      skip,
      fail,
    } = ctx;
    const assert: AssertFn = ctx.assert;

    if (!acceptedAds.has(data.key)) {
      skip({ silent: true });
      return;
    }
    const shipmentId = pickedUpShipments.get(data.key);
    assert(shipmentId, `No picked up shipment for ad ${data.key}`);
    const ship = shipsStore.getById(data.shipId);
    assert(ship, 'Ship not found');

    setStatus('Waiting for shipment...');
    await Promise.race([
      watchUntil(() => findStoreWithItem(shipmentId) !== undefined),
      sleep(storeUpdateTimeoutMs),
    ]);
    const from = findStoreWithItem(shipmentId);
    if (!from) {
      fail(`Shipment of ad ${data.key} not found in any inventory`);
      return;
    }
    if (from.id === ship.idShipStore) {
      log.info(`Shipment of ad ${data.key} is already in ${ship.name ?? ship.registration}`);
      complete();
      return;
    }

    const targetCommand = `INV ${ship.idShipStore.substring(0, 8)}`;
    if (!(await requestTile(targetCommand))) {
      return;
    }
    // The game drags between inventory tiles only, so the source needs its own tile.
    const sourceTile = await requestSecondaryTile(`INV ${from.id.substring(0, 8)}`);
    if (!sourceTile) {
      return;
    }
    // The split renders the first tile again, so get its new element.
    const tile = await requestTile(targetCommand);
    if (!tile) {
      return;
    }
    const source = await $(sourceTile.anchor, C.InventoryView.grid);
    const item = source
      .querySelector(`[data-prun-id="${shipmentId}"]`)
      ?.closest<HTMLElement>('[draggable="true"]');
    assert(item, 'Shipment item not found');

    await waitAct(`Move shipment of ad ${data.key}?`);
    if (!(await dragAndDrop(item, tile.anchor))) {
      fail('Transfer drop target not found');
      return;
    }
    setStatus('Waiting for storage update...');
    await Promise.race([
      watchUntil(() => findStoreWithItem(shipmentId)?.id === ship.idShipStore),
      sleep(storeUpdateTimeoutMs),
    ]);
    if (findStoreWithItem(shipmentId)?.id !== ship.idShipStore) {
      fail(`Shipment of ad ${data.key} was not moved`);
      return;
    }
    log.success(`Moved shipment of ad ${data.key}`);
    complete();
  },
});

function findStoreWithItem(itemId: string) {
  return storagesStore.all.value?.find(x => x.items.some(i => i.id === itemId));
}

// The game's drag library publishes the drag source in a timeout after dragstart.
// During a drag, each other inventory shows a transfer overlay with "1" and "ALL" drop targets.
async function dragAndDrop(source: HTMLElement, targetTile: HTMLElement) {
  const dataTransfer = new DataTransfer();
  const fire = (element: HTMLElement, type: string) => {
    const rect = element.getBoundingClientRect();
    const event = new DragEvent(type, {
      bubbles: true,
      cancelable: true,
      dataTransfer,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
    });
    element.dispatchEvent(event);
  };
  fire(source, 'dragstart');
  try {
    await Promise.race([
      $(targetTile, C.StoreTransferOverlay.container),
      sleep(dropTargetTimeoutMs),
    ]);
    const overlay = _$(targetTile, C.StoreTransferOverlay.container);
    const all = overlay ? _$$(overlay, C.DropTargetView.container).at(-1) : undefined;
    if (!all) {
      return false;
    }
    await sleep(50);
    fire(all, 'dragenter');
    fire(all, 'dragover');
    await sleep(50);
    fire(all, 'drop');
    return true;
  } finally {
    fire(source, 'dragend');
  }
}
