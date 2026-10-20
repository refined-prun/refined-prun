import { act } from '@src/features/XIT/ACT/act-registry';
import { AssertFn } from '@src/features/XIT/ACT/shared-types';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { isFulfillable } from '@src/core/contract-conditions';
import { clickElement } from '@src/util';
import { fixed01 } from '@src/utils/format';
import { watchUntil } from '@src/utils/watch';
import { sleep } from '@src/utils/sleep';
import { acceptedAds } from '@src/features/XIT/ACT/action-steps/LMA_ACCEPT';

interface Data {
  key: string;
  origin: string;
  weight: number;
  volume: number;
  creatorCode: string;
}

const epsilon = 0.001;

// Picked up shipment item ids by ad key. A shipment item has the id of its pickup condition.
export const pickedUpShipments = new Map<string, string>();

// The contract and its fulfilled provision condition arrive some time after the accept.
const contractTimeoutMs = 30000;

export const CONT_PICKUP = act.addActionStep<Data>({
  type: 'CONT_PICKUP',
  description: data =>
    `Pick up shipment of ad ${data.key} (${fixed01(data.weight)}t / ${fixed01(data.volume)}m³) at ${data.origin}`,
  execute: async ctx => {
    const { data, log, setStatus, requestTile, waitAct, waitActionFeedback, complete, skip, fail } =
      ctx;
    const assert: AssertFn = ctx.assert;

    if (!acceptedAds.has(data.key)) {
      skip({ silent: true });
      return;
    }

    setStatus('Waiting for contract...');
    await Promise.race([
      watchUntil(() => findPickup(data) !== undefined),
      sleep(contractTimeoutMs),
    ]);
    const match = findPickup(data);
    if (!match) {
      fail(`No contract to pick up for ad ${data.key}`);
      return;
    }

    const tile = await requestTile(`CONT ${match.contract.localId}`);
    if (!tile) {
      return;
    }

    await $(tile.anchor, 'tbody');
    // The CONT table renders conditions in their array order.
    const index = match.contract.conditions.findIndex(x => x.id === match.condition.id);
    const rows = _$$(tile.anchor, 'tr').filter(x => _$$(x, 'td').length > 0);
    const row = index >= 0 && index < rows.length ? rows[index] : undefined;
    const button = row ? _$(row, C.Button.success) : undefined;
    assert(button, 'Pickup button not found');

    await waitAct(`Pick up shipment of ad ${data.key}?`);
    await clickElement(button);
    await waitActionFeedback(tile);
    pickedUpShipments.set(data.key, match.condition.id);
    log.success(`Picked up shipment of ad ${data.key}`);
    complete();
  },
});

function findPickup(data: Data) {
  const contracts = (contractsStore.all.value ?? [])
    .slice()
    .sort((a, b) => b.date.timestamp - a.date.timestamp);
  for (const contract of contracts) {
    if (contract.partner.code !== data.creatorCode) {
      continue;
    }
    const condition = contract.conditions.find(
      x =>
        x.type === 'PICKUP_SHIPMENT' &&
        getEntityNaturalIdFromAddress(x.address) === data.origin &&
        Math.abs((x.weight ?? 0) - data.weight) < epsilon &&
        Math.abs((x.volume ?? 0) - data.volume) < epsilon &&
        isFulfillable(contract, x),
    );
    if (condition) {
      return { contract, condition };
    }
  }
  return undefined;
}
