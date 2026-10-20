import { localAdsStore } from '@src/infrastructure/prun-api/data/local-ads';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { stationsStore } from '@src/infrastructure/prun-api/data/stations';
import { starsStore, getStarName, getStarNaturalId } from '@src/infrastructure/prun-api/data/stars';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import {
  getEntityNaturalIdFromAddress,
  getSystemLineFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import {
  FioShippingDirection,
  getFioShippingAds,
} from '@src/infrastructure/fio/local-market-shipping';
import { getFioGateways } from '@src/infrastructure/fio/gateways';
import { getReachableSystems } from '@src/core/shipping/reachability';
import { timestampEachMinute } from '@src/utils/dayjs';
import { solveKnapsack } from '@src/core/shipping/knapsack';

export interface ShippingAd {
  // LMA parameter, for example `BEN/8036`.
  key: string;
  lm: string;
  origin: string;
  destination: string;
  weight: number;
  volume: number;
  value: number;
  currency: string;
  creatorId: string;
  creatorCode: string;
  expiry: number;
  minimumRating: string;
  fromFio: boolean;
  // The live ad, or one built from FIO data, so LM features can treat both the same way.
  localAd: PrunApi.LocalAd;
}

// FIO ads shown on LM, by the id of their built LocalAd.
const fioLocalAds = new Map<string, PrunApi.LocalAd>();

export function getLocalAdById(id?: string | null) {
  return localAdsStore.getById(id) ?? (id ? fioLocalAds.get(id) : undefined);
}

function fromLocalAd(ad: PrunApi.LocalAd, fromFio: boolean): ShippingAd | undefined {
  const lm = getEntityNaturalIdFromAddress(ad.address);
  const origin = getEntityNaturalIdFromAddress(ad.origin);
  const destination = getEntityNaturalIdFromAddress(ad.destination);
  if (!lm || !origin || !destination) {
    return undefined;
  }
  return {
    key: `${lm}/${ad.naturalId}`,
    lm,
    origin,
    destination,
    weight: ad.cargoWeight ?? 0,
    volume: ad.cargoVolume ?? 0,
    value: ad.price.amount,
    currency: ad.price.currency,
    creatorId: ad.creator.id,
    creatorCode: ad.creator.code,
    expiry: ad.expiry.timestamp,
    minimumRating: ad.minimumRating,
    fromFio,
    localAd: ad,
  };
}

function fromFioAd(ad: FioApi.ShippingAd) {
  const id = `fio-${ad.PlanetNaturalId}/${ad.ContractNaturalId}`;
  let localAd = fioLocalAds.get(id);
  if (!localAd) {
    localAd = {
      id,
      localMarketId: id,
      naturalId: ad.ContractNaturalId,
      type: 'COMMODITY_SHIPPING',
      status: 'OPEN',
      address: fioAddress(ad.PlanetId, ad.PlanetNaturalId, ad.PlanetName),
      origin: fioAddress(ad.OriginPlanetId, ad.OriginPlanetNaturalId, ad.OriginPlanetName),
      destination: fioAddress(
        ad.DestinationPlanetId,
        ad.DestinationPlanetNaturalId,
        ad.DestinationPlanetName,
      ),
      cargoWeight: ad.CargoWeight,
      cargoVolume: ad.CargoVolume,
      creator: {
        id: ad.CreatorCompanyId,
        code: ad.CreatorCompanyCode,
        name: ad.CreatorCompanyName,
      },
      quantity: null,
      price: { amount: ad.PayoutPrice, currency: ad.PayoutCurrency },
      advice: ad.DeliveryTime,
      creationTime: { timestamp: ad.CreationTimeEpochMs },
      expiry: { timestamp: ad.ExpiryTimeEpochMs },
      minimumRating: ad.MinimumRating,
    };
    fioLocalAds.set(id, localAd);
  }
  return fromLocalAd(localAd, true);
}

function fioAddress(id: string, naturalId: string, name: string): PrunApi.Address {
  const station = stationsStore.getByNaturalId(naturalId);
  if (station) {
    return station.address;
  }
  const systemNaturalId = naturalId.slice(0, -1);
  const star = starsStore.getByNaturalId(systemNaturalId);
  return {
    lines: [
      {
        type: 'SYSTEM',
        entity: {
          id: star?.systemId ?? systemNaturalId,
          naturalId: systemNaturalId,
          name: star ? getStarName(star) : systemNaturalId,
        },
      },
      { type: 'PLANET', entity: { id, naturalId, name } },
    ],
  };
}

const allLiveAds = computed(
  () =>
    localAdsStore.all.value
      ?.filter(x => x.type === 'COMMODITY_SHIPPING')
      .map(x => fromLocalAd(x, false))
      .filter(x => x !== undefined) ?? [],
);

// Taken ads stay in the live store with another status, for example ACCEPTED.
const liveAds = computed(() => allLiveAds.value.filter(x => x.localAd.status === 'OPEN'));

const takenAdKeys = computed(
  () => new Set(allLiveAds.value.filter(x => x.localAd.status !== 'OPEN').map(x => x.key)),
);

// A fully loaded LM is the truth: its ads missing from the live store were taken or removed.
const liveLms = computed(
  () =>
    new Set(
      allLiveAds.value
        .filter(x => localAdsStore.isMarketFullyLoaded(x.localAd.localMarketId))
        .map(x => x.lm),
    ),
);

export function getShippingAds(direction: FioShippingDirection, location: string) {
  const byKey = new Map<string, ShippingAd>();
  for (const ad of getFioShippingAds(direction, location)?.ads ?? []) {
    const converted = fromFioAd(ad);
    if (converted && !liveLms.value.has(converted.lm) && !takenAdKeys.value.has(converted.key)) {
      byKey.set(converted.key, converted);
    }
  }
  const field = direction === 'source' ? 'origin' : 'destination';
  for (const ad of liveAds.value) {
    if (ad[field] === location) {
      byKey.set(ad.key, ad);
    }
  }
  const now = timestampEachMinute.value;
  return [...byKey.values()].filter(x => x.expiry > now);
}

// Ads the player can accept: not their own and within their rating.
export function getAcceptableShippingAds(direction: FioShippingDirection, location: string) {
  const company = companyStore.value;
  return getShippingAds(direction, location).filter(
    x => x.creatorId !== company?.id && meetsRating(company?.ratingReport.overallRating, x),
  );
}

const ratingOrder = ['PENDING', 'F', 'E', 'D', 'C', 'B', 'A'];

function meetsRating(rating: string | undefined, ad: ShippingAd) {
  const own = ratingOrder.indexOf(rating ?? '');
  const required = ratingOrder.indexOf(ad.minimumRating);
  // Unknown values must not hide ads.
  return own === -1 || required === -1 || own >= required;
}

export function getSystemNaturalId(location: string) {
  const station = stationsStore.getByNaturalId(location);
  if (station) {
    return getSystemLineFromAddress(station.address)?.entity.naturalId;
  }
  return location.slice(0, -1);
}

const ftlGraph = computed(() => {
  const graph = new Map<string, string[]>();
  for (const star of starsStore.all.value ?? []) {
    const neighbors = star.connections
      .map(x => starsStore.getById(x))
      .filter(x => x !== undefined)
      .map(getStarNaturalId);
    graph.set(getStarNaturalId(star), neighbors);
  }
  return graph;
});

export function shipHasFtl(ship: PrunApi.Ship) {
  return (storagesStore.getById(ship.idFtlFuelStore)?.volumeCapacity ?? 0) > 0;
}

export function getShipReachableSystems(ship: PrunApi.Ship) {
  const location = getEntityNaturalIdFromAddress(ship.address);
  const system = location ? getSystemNaturalId(location) : undefined;
  if (!system) {
    return undefined;
  }
  const graph = {
    ftl: ftlGraph.value,
    gateways: getFioGateways() ?? [],
    getSystem: getSystemNaturalId,
  };
  return getReachableSystems(graph, system, ship.volume, shipHasFtl(ship));
}

export function getLiveShippingAd(key: string) {
  return allLiveAds.value.find(x => x.key === key);
}

export function getShipFreeSpace(ship: PrunApi.Ship) {
  const store = storagesStore.getById(ship.idShipStore);
  if (!store) {
    return undefined;
  }
  return {
    weight: store.weightCapacity - store.weightLoad,
    volume: store.volumeCapacity - store.volumeLoad,
  };
}

// Best set of ads that a docked ship can carry from its location to the destination.
export function planShipLoad(ship: PrunApi.Ship, destination: string, exclude?: Set<string>) {
  const here = getEntityNaturalIdFromAddress(ship.address);
  const space = getShipFreeSpace(ship);
  if (ship.flightId || !here || !space) {
    return undefined;
  }
  const ads = getAcceptableShippingAds('source', here).filter(
    x => x.destination === destination && !exclude?.has(x.key),
  );
  return solveKnapsack(ads, space.weight, space.volume);
}
