import { act } from '@src/features/XIT/ACT/act-registry';
import Edit from '@src/features/XIT/ACT/actions/ship-contracts/Edit.vue';
import { AssertFn } from '@src/features/XIT/ACT/shared-types';
import { LMA_ACCEPT } from '@src/features/XIT/ACT/action-steps/LMA_ACCEPT';
import { CONT_PICKUP } from '@src/features/XIT/ACT/action-steps/CONT_PICKUP';
import { INV_MOVE_SHIPMENT } from '@src/features/XIT/ACT/action-steps/INV_MOVE_SHIPMENT';
import { OPEN_SFC } from '@src/features/XIT/ACT/action-steps/OPEN_SFC';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { getShippingAds } from '@src/core/shipping/shipping-ads';

act.addAction({
  type: 'Ship Contracts',
  shortDescription: 'Accept, pick up and load shipping ads, then open SFC',
  description: action =>
    action.ship && action.sfcDestination
      ? `Load ${action.ship} with ${action.adKeys?.length ?? 0} shipping ads to ${action.sfcDestination}`
      : '--',
  editComponent: Edit,
  generateSteps: async ctx => {
    const { data, log, emitStep } = ctx;
    const assert: AssertFn = ctx.assert;

    const ship = shipsStore.getByRegistration(data.ship) ?? shipsStore.getById(data.ship);
    assert(ship, 'Ship not found');
    const here = getEntityNaturalIdFromAddress(ship.address);
    assert(here, 'Ship is not docked');
    assert(data.sfcDestination, 'Destination not set');

    const ads = new Map(getShippingAds('source', here).map(x => [x.key, x]));
    for (const key of data.adKeys ?? []) {
      const ad = ads.get(key);
      if (!ad) {
        log.warning(`Ad ${key} does not start at ${here} or is not available`);
        continue;
      }
      emitStep(
        LMA_ACCEPT({
          key: ad.key,
          origin: ad.origin,
          destination: ad.destination,
          weight: ad.weight,
          volume: ad.volume,
          value: ad.value,
          currency: ad.currency,
        }),
      );
      emitStep(
        CONT_PICKUP({
          key: ad.key,
          origin: ad.origin,
          weight: ad.weight,
          volume: ad.volume,
          creatorCode: ad.creatorCode,
        }),
      );
      emitStep(INV_MOVE_SHIPMENT({ key: ad.key, shipId: ship.id }));
    }
    emitStep(OPEN_SFC({ shipId: ship.id, destination: data.sfcDestination }));
  },
});
