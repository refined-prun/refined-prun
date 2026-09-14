import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { exchangesStore } from '@src/infrastructure/prun-api/data/exchanges';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import {
  getLocationLineFromAddress,
  isSameAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { computeResupplyBill } from '@src/features/XIT/ACT/material-groups/resupply/bill';
import { maxFittingDays } from '@src/features/XIT/ACT/material-groups/resupply/fit-days';
import { computeRepairBill } from '@src/features/XIT/ACT/material-groups/repair/bill';
import type { MaterialFilter } from '@src/features/XIT/ACT/material-groups/resupply/config';
import { billTotals, MaterialBill, mergeBills } from '@src/features/XIT/ACT/material-bill';

export interface DispatchBaseConfig {
  resupply: boolean;
  repair: boolean;
  days: number;
  repThreshold: number;
  repAdvance: number;
  materialFilter: MaterialFilter;
  cxBuy: boolean;
  offloadJson: boolean;
  agent: boolean;
  ship?: string;
}

export interface DispatchShip {
  ship: PrunApi.Ship;
  exchangeCode: string;
  warehouseStore?: PrunApi.Store;
  cargoStore?: PrunApi.Store;
}

export function getShipsAtCX() {
  const ships = shipsStore.all.value;
  if (!ships) {
    return undefined;
  }

  const exchanges = exchangesStore.all.value ?? [];
  const warehouses = warehousesStore.all.value ?? [];
  const result: DispatchShip[] = [];

  for (const ship of ships) {
    const location = getLocationLineFromAddress(ship.address);
    if (location?.type !== 'STATION') {
      continue;
    }

    // Stations share their system's naturalId; compare entity ids via isSameAddress.
    const exchange = exchanges.find(
      x =>
        isSameAddress(ship.address, x.address) ||
        getLocationLineFromAddress(x.address)?.entity.id === location.entity.id,
    );
    if (!exchange) {
      continue;
    }

    const warehouse = warehouses.find(
      x =>
        isSameAddress(ship.address, x.address) ||
        getLocationLineFromAddress(x.address)?.entity.id === location.entity.id,
    );
    const warehouseStore = storagesStore
      .getByAddressableId(warehouse?.warehouseId)
      ?.find(x => x.type === 'WAREHOUSE_STORE');
    const cargoStore = storagesStore
      .getByAddressableId(ship.id)
      ?.find(x => x.type === 'SHIP_STORE');

    result.push({
      ship,
      exchangeCode: exchange.code,
      warehouseStore,
      cargoStore,
    });
  }

  return result;
}

export function combinedBaseBill(
  naturalId: string,
  config: DispatchBaseConfig,
  site: PrunApi.Site,
) {
  if (!config.resupply && !config.repair) {
    return undefined;
  }

  let resupply: MaterialBill | undefined;
  if (config.resupply) {
    resupply = computeResupplyBill(
      { type: 'Resupply', useBaseInv: true },
      naturalId,
      config.days,
      config.materialFilter,
    );
    // Burn data not loaded yet.
    if (resupply === undefined) {
      return undefined;
    }
  }

  let repair: MaterialBill | undefined;
  if (config.repair) {
    repair = computeRepairBill(site, config.repThreshold, config.repAdvance);
  }

  return mergeBills(resupply, repair);
}

// Move each assigned base after the last earlier row for the same ship.
export function regroupByShip(order: string[], shipOf: Map<string, string>) {
  const result: string[] = [];
  const lastIndexForShip = new Map<string, number>();
  for (const id of order) {
    const ship = shipOf.get(id);
    if (ship && lastIndexForShip.has(ship)) {
      const insertAt = lastIndexForShip.get(ship)! + 1;
      result.splice(insertAt, 0, id);
      for (const [otherShip, index] of lastIndexForShip) {
        if (index >= insertAt) {
          lastIndexForShip.set(otherShip, index + 1);
        }
      }
      lastIndexForShip.set(ship, insertAt);
    } else {
      result.push(id);
      if (ship) {
        lastIndexForShip.set(ship, result.length - 1);
      }
    }
  }
  return result;
}

export function fitDaysForShip(
  shipId: string,
  bases: { naturalId: string; config: DispatchBaseConfig; site: PrunApi.Site }[],
  cargoStore: PrunApi.Store,
) {
  const sharing = bases.filter(x => x.config.ship === shipId);

  let repairWeight = 0;
  let repairVolume = 0;
  for (const base of sharing) {
    if (!base.config.repair) {
      continue;
    }
    const bill = computeRepairBill(base.site, base.config.repThreshold, base.config.repAdvance);
    const totals = billTotals(bill);
    repairWeight += totals.weight;
    repairVolume += totals.volume;
  }

  const freeWeight = cargoStore.weightCapacity - cargoStore.weightLoad - repairWeight;
  const freeVolume = cargoStore.volumeCapacity - cargoStore.volumeLoad - repairVolume;
  if (freeWeight < 0 || freeVolume < 0) {
    return 0;
  }

  // Quick check that burn data is loaded for every resupply base.
  for (const base of sharing) {
    if (!base.config.resupply) {
      continue;
    }
    if (
      !computeResupplyBill(
        { type: 'Resupply', useBaseInv: true },
        base.naturalId,
        1,
        base.config.materialFilter,
      )
    ) {
      return undefined;
    }
  }

  return maxFittingDays(days => {
    let weight = 0;
    let volume = 0;
    for (const base of sharing) {
      if (!base.config.resupply) {
        continue;
      }
      const entries = computeResupplyBill(
        { type: 'Resupply', useBaseInv: true },
        base.naturalId,
        days,
        base.config.materialFilter,
      )!;
      const totals = billTotals(entries);
      weight += totals.weight;
      volume += totals.volume;
      if (weight > freeWeight || volume > freeVolume) {
        return false;
      }
    }
    return true;
  });
}
