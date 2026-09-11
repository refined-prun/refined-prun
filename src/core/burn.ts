import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { getRecurringOrders } from '@src/core/orders';
import { userData } from '@src/store/user-data';

export interface MaterialBurn {
  input: number;
  output: number;
  workforce: number;
  dailyAmount: number;
  remainingAllocation: number;
  inventory: number;
  inboundInventory: number;
  daysLeft: number;
  type: 'input' | 'output' | 'workforce';
}

export interface BurnValues {
  [ticker: string]: MaterialBurn;
}

export interface PlanetBurn {
  storeId: string;
  planetName: string;
  naturalId: string;
  burn: BurnValues;
}

const burnBySiteId = createBurnBySiteId(
  id => workforcesStore.getById(id)?.workforces,
  id => productionStore.getBySiteId(id),
);

const passiveBurnBySiteId = createBurnBySiteId(
  id => workforcesStore.passiveGetById(id)?.workforces,
  id => productionStore.passiveGetBySiteId(id),
);

function createBurnBySiteId(
  getWorkforces: (siteId: string) => PrunApi.Workforce[] | undefined,
  getProduction: (siteId: string) => PrunApi.ProductionLine[] | undefined,
) {
  return computed(() => {
    if (!sitesStore.all.value) {
      return undefined;
    }

    const bySiteId = new Map<string, Ref<PlanetBurn | undefined>>();
    for (const site of sitesStore.all.value) {
      bySiteId.set(
        site.siteId,
        computed(() => {
          const id = site.siteId;
          const workforce = getWorkforces(id);
          const production = getProduction(id);
          const storage = storagesStore.getByAddressableId(id);
          if (!workforce || !production) {
            return undefined;
          }

          const naturalId = getEntityNaturalIdFromAddress(site.address);
          const inboundStores = getInboundShipStores(naturalId);

          return {
            storeId: storage?.[0]?.id,
            planetName: getEntityNameFromAddress(site.address),
            naturalId,
            burn: calculatePlanetBurn(production, workforce, storage, inboundStores),
          } as PlanetBurn;
        }),
      );
    }
    return bySiteId;
  });
}

// Ships currently in flight towards the planet. Landed ships are excluded.
export function getInboundShips(planetNaturalId: string | undefined) {
  if (planetNaturalId === undefined) {
    return [];
  }
  const ships = shipsStore.all.value;
  if (!ships) {
    return [];
  }
  const result: PrunApi.Ship[] = [];
  for (const ship of ships) {
    if (!ship.flightId) {
      continue;
    }
    const flight = flightsStore.getById(ship.flightId);
    if (!flight) {
      continue;
    }
    if (getEntityNaturalIdFromAddress(flight.destination) !== planetNaturalId) {
      continue;
    }
    result.push(ship);
  }
  return result;
}

export function getInboundShipStores(planetNaturalId: string | undefined) {
  return getInboundShips(planetNaturalId)
    .map(x => storagesStore.getById(x.idShipStore))
    .filter(x => !!x);
}

// Production and consumption that cancel exactly still leave floating-point residue
// (e.g. -5.5e-17). That reads as a net consumer, so a material in perfect balance with
// no stock renders as "0 days left" and gets pulled into resupply. Any net rate below
// this is indistinguishable from zero at the quantities the game ships in.
const nearZeroDailyAmount = 0.01;

// Snaps a net daily rate that is effectively zero to exactly zero, so daysLeft
// resolves to infinity rather than to a residue-driven number.
export function clampNearZeroDailyAmount(dailyAmount: number) {
  return dailyAmount > -nearZeroDailyAmount && dailyAmount < nearZeroDailyAmount ? 0 : dailyAmount;
}

export function getPlanetBurn(siteOrId?: PrunApi.Site | string | null) {
  return getPlanetBurnFromMap(burnBySiteId, siteOrId);
}

export function getPlanetBurnPassive(siteOrId?: PrunApi.Site | string | null) {
  return getPlanetBurnFromMap(passiveBurnBySiteId, siteOrId);
}

function getPlanetBurnFromMap(
  bySiteId: Ref<Map<string, Ref<PlanetBurn | undefined>> | undefined>,
  siteOrId?: PrunApi.Site | string | null,
) {
  const site = typeof siteOrId === 'string' ? sitesStore.getById(siteOrId) : siteOrId;
  if (!site) {
    return undefined;
  }

  return bySiteId.value?.get(site.siteId)?.value;
}

export function calculatePlanetBurn(
  production: PrunApi.ProductionLine[] | undefined,
  workforces: PrunApi.Workforce[] | undefined,
  storage: PrunApi.Store[] | undefined,
  inboundStorage?: PrunApi.Store[],
) {
  const burnValues: BurnValues = {};

  function getBurnValue(material: PrunApi.Material) {
    const ticker = material.ticker;
    burnValues[ticker] ??= {
      input: 0,
      output: 0,
      workforce: 0,
      dailyAmount: 0,
      remainingAllocation: 0,
      inventory: 0,
      inboundInventory: 0,
      daysLeft: 0,
      type: 'output',
    };
    return burnValues[ticker];
  }

  if (production) {
    for (const line of production) {
      const capacity = line.capacity;
      const burnOrders = getRecurringOrders(line);
      let totalDuration = sumBy(burnOrders, x => x.duration?.millis ?? Infinity);
      // Convert to days
      totalDuration /= 86400000;

      for (const order of burnOrders) {
        for (const amount of order.outputs) {
          getBurnValue(amount.material).output += (amount.amount * capacity) / totalDuration;
        }
        for (const amount of order.inputs) {
          getBurnValue(amount.material).input += (amount.amount * capacity) / totalDuration;
        }
      }
    }
  }

  if (workforces) {
    for (const tier of workforces) {
      if (tier.population <= 1) {
        // Don't count the bugged workforce with one population.
        continue;
      }
      if (tier.capacity === 0) {
        // After demolishing housing, you can get homeless pops that don't consume goods.
        continue;
      }
      for (const need of tier.needs) {
        const mat = getBurnValue(need.material);
        mat.workforce += need.unitsPerInterval;
        mat.remainingAllocation += need.remainingAllocation;
      }
    }
  }

  addInventory(storage, 'inventory');
  addInventory(inboundStorage, 'inboundInventory');

  function addInventory(
    stores: PrunApi.Store[] | undefined,
    field: 'inventory' | 'inboundInventory',
  ) {
    for (const inventory of stores ?? []) {
      for (const item of inventory.items) {
        const quantity = item.quantity;
        if (!quantity) {
          continue;
        }
        const materialBurn = burnValues[quantity.material.ticker];
        if (materialBurn === undefined) {
          continue;
        }
        materialBurn[field] += quantity.amount;
      }
    }
  }

  for (const ticker in burnValues) {
    const mat = burnValues[ticker];
    mat.dailyAmount = mat.output;
    mat.type = 'output';
    mat.dailyAmount -= mat.workforce;
    if (mat.workforce > 0 && mat.dailyAmount <= 0) {
      mat.type = 'workforce';
    }
    mat.dailyAmount -= mat.input;
    if (mat.input > 0 && mat.dailyAmount <= 0) {
      mat.type = 'input';
    }
    mat.dailyAmount = clampNearZeroDailyAmount(mat.dailyAmount);
    const inv = mat.remainingAllocation + mat.inventory + mat.inboundInventory;
    mat.daysLeft = mat.dailyAmount >= 0 ? Number.POSITIVE_INFINITY : inv / -mat.dailyAmount;
  }

  return burnValues;
}

// Days left of the most urgent net-consumed material.
export function getMinDaysLeft(burn: BurnValues) {
  let days = 1000;
  for (const key of Object.keys(burn)) {
    const mat = burn[key];
    if (mat.dailyAmount < 0 && mat.daysLeft < days) {
      days = mat.daysLeft;
    }
  }
  return days;
}

export function getResupplyDays(planetNaturalId?: string | null) {
  if (planetNaturalId) {
    const override = userData.settings.burn.planetResupply[planetNaturalId];
    if (override !== undefined) {
      return override;
    }
  }
  return userData.settings.burn.resupply;
}

export function computeNeed(mat: MaterialBurn, resupplyDays: number) {
  const production = mat.dailyAmount;
  const days = mat.daysLeft;
  if (days > resupplyDays || production >= 0) {
    return 0;
  }
  const need = Math.ceil((days - resupplyDays) * production);
  // Math.abs is needed to prevent a "-0" value that can happen
  // in situations like: 0 * -0.25 => -0.
  return Math.abs(need);
}
