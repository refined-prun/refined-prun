import { act } from '@src/features/XIT/ACT/act-registry';
import Edit from '@src/features/XIT/ACT/actions/refuel/Edit.vue';
import Configure from '@src/features/XIT/ACT/actions/refuel/Configure.vue';
import { Config } from '@src/features/XIT/ACT/actions/refuel/config';
import { CX_BUY } from '@src/features/XIT/ACT/action-steps/CX_BUY';
import { TRANSFER_MATERIALS } from '@src/features/XIT/ACT/action-steps/TRANSFER_MATERIALS';
import { AssertFn, configurableValue } from '@src/features/XIT/ACT/shared-types';
import {
  atSameLocation,
  deserializeStorage,
  isCXWarehouse,
} from '@src/features/XIT/ACT/actions/utils';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { ExchangeTickers } from '@src/legacy';

act.addAction<Config>({
  type: 'Refuel',
  description: action => {
    return action.origin ? 'Refuel all ships near ' + action.origin : '--';
  },
  editComponent: Edit,
  configureComponent: Configure,
  needsConfigure: data => {
    return data.origin === configurableValue;
  },
  isValidConfig: (data, config) => {
    return data.origin !== configurableValue || config.origin !== undefined;
  },
  generateSteps: async ctx => {
    const { data, config, log, emitStep } = ctx;
    const assert: AssertFn = ctx.assert;

    const serializedOrigin = data.origin === configurableValue ? config?.origin : data.origin;
    const origin = deserializeStorage(serializedOrigin);
    assert(origin, 'Invalid origin');

    const isCX = isCXWarehouse(origin);

    const dockedStl = (storagesStore.all.value ?? []).filter(
      x => x.type === 'STL_FUEL_STORE' && atSameLocation(x, origin),
    );

    const dockedFtl = (storagesStore.all.value ?? []).filter(
      x => x.type === 'FTL_FUEL_STORE' && atSameLocation(x, origin),
    );

    if (dockedStl.length === 0 && dockedFtl.length === 0) {
      log.warning('No ships are docked near the origin');
      return;
    }

    const stlMaterial = materialsStore.getByTicker('SF');
    assert(stlMaterial, 'SF material not found');

    const ftlMaterial = materialsStore.getByTicker('FF');
    assert(ftlMaterial, 'FF material not found');

    const totalStlRefuel = dockedStl.reduce(
      (acc, x) => acc + calculateRefuelAmount(x, stlMaterial),
      0,
    );

    const totalFtlRefuel = dockedFtl.reduce(
      (acc, x) => acc + calculateRefuelAmount(x, ftlMaterial),
      0,
    );

    if (totalFtlRefuel === 0 && totalStlRefuel === 0) {
      log.warning('No ships need refueling');
      return;
    }

    const presentStlFuel =
      origin.items.find(x => x.quantity?.material.ticker === stlMaterial.ticker)?.quantity
        ?.amount ?? 0;

    if (presentStlFuel < totalStlRefuel) {
      assert(isCX && data.buyMissingFuel, 'Not enough SF at the origin');
      emitStep(
        CX_BUY({
          exchange: getExchangeCode(origin),
          ticker: stlMaterial.ticker,
          amount: totalStlRefuel - presentStlFuel,
          priceLimit: Number.POSITIVE_INFINITY,
          buyPartial: false,
        }),
      );
    }

    const presentFtlFuel =
      origin.items.find(x => x.quantity?.material.ticker === ftlMaterial.ticker)?.quantity
        ?.amount ?? 0;

    if (presentFtlFuel < totalFtlRefuel) {
      assert(isCX && data.buyMissingFuel, 'Not enough FF at the origin');
      emitStep(
        CX_BUY({
          exchange: getExchangeCode(origin),
          ticker: ftlMaterial.ticker,
          amount: totalFtlRefuel - presentFtlFuel,
          priceLimit: Number.POSITIVE_INFINITY,
          buyPartial: false,
        }),
      );
    }

    for (const store of dockedStl) {
      const amount = calculateRefuelAmount(store, stlMaterial);
      if (amount === 0) {
        continue;
      }
      emitStep(
        TRANSFER_MATERIALS({
          from: origin.id,
          to: store.id,
          ticker: stlMaterial.ticker,
          amount,
        }),
      );
    }

    for (const store of dockedFtl) {
      const amount = calculateRefuelAmount(store, ftlMaterial);
      if (amount === 0) {
        continue;
      }
      emitStep(
        TRANSFER_MATERIALS({
          from: origin.id,
          to: store.id,
          ticker: ftlMaterial.ticker,
          amount,
        }),
      );
    }
  },
});

function getExchangeCode(store: PrunApi.Store) {
  const warehouse = warehousesStore.getById(store.addressableId);
  const originNaturalId = getEntityNaturalIdFromAddress(warehouse?.address);
  return originNaturalId ? ExchangeTickers[originNaturalId] : undefined;
}

function calculateRefuelAmount(store: PrunApi.Store, material: PrunApi.Material) {
  // Fuel stores have the same volume/weight capacity ratio as the material,
  // so we can use either one.
  const freeVolume = store.volumeCapacity - store.volumeLoad;
  return Math.floor(freeVolume / material.volume);
}
