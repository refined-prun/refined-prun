import { getPlanetBurn, PlanetBurn } from '@src/core/burn';
import { getMarketPrices, MarketPrices } from '@src/infrastructure/fio/cx';
import { userData } from '@src/store/user-data';

export interface PlanetContribution {
  naturalId: string;
  planetName: string;
  amount: number;
}

export interface FlowPrices extends MarketPrices {
  buyOverride: boolean;
  sellOverride: boolean;
}

export interface MaterialFlow extends FlowPrices {
  ticker: string;
  production: number;
  consumption: number;
  delta: number;
  // Surplus is valued at the sell price, deficit at the buy price.
  currencyDelta: number | undefined;
  producers: PlanetContribution[];
  consumers: PlanetContribution[];
}

export type PriceSide = 'buy' | 'sell';

export function calculateMaterialFlow(
  burns: PlanetBurn[],
  prices: (ticker: string) => FlowPrices,
): MaterialFlow[] {
  const byTicker = new Map<string, MaterialFlow>();
  for (const planet of burns) {
    for (const ticker of Object.keys(planet.burn)) {
      const mat = planet.burn[ticker];
      let flow = byTicker.get(ticker);
      if (!flow) {
        flow = {
          ticker,
          production: 0,
          consumption: 0,
          delta: 0,
          buy: undefined,
          sell: undefined,
          buyOverride: false,
          sellOverride: false,
          currencyDelta: undefined,
          producers: [],
          consumers: [],
        };
        byTicker.set(ticker, flow);
      }

      const contribution = { naturalId: planet.naturalId, planetName: planet.planetName };
      if (mat.output > 0) {
        flow.production += mat.output;
        flow.producers.push({ ...contribution, amount: mat.output });
      }
      const consumed = mat.input + mat.workforce;
      if (consumed > 0) {
        flow.consumption += consumed;
        flow.consumers.push({ ...contribution, amount: consumed });
      }
    }
  }

  const result: MaterialFlow[] = [];
  for (const flow of byTicker.values()) {
    if (flow.production === 0 && flow.consumption === 0) {
      continue;
    }
    flow.delta = flow.production - flow.consumption;
    const { buy, sell, buyOverride, sellOverride } = prices(flow.ticker);
    flow.buy = buy;
    flow.sell = sell;
    flow.buyOverride = buyOverride;
    flow.sellOverride = sellOverride;
    const price = flow.delta < 0 ? flow.buy : flow.sell;
    flow.currencyDelta = price === undefined ? undefined : flow.delta * price;
    flow.producers.sort((a, b) => b.amount - a.amount);
    flow.consumers.sort((a, b) => b.amount - a.amount);
    result.push(flow);
  }
  return result;
}

// Sites whose production or workforce data hasn't arrived yet are omitted.
export function getMaterialFlow(sites: PrunApi.Site[]) {
  const burns = sites.map(getPlanetBurn).filter(x => x !== undefined);
  return calculateMaterialFlow(burns, getFlowPrices);
}

export function getFlowPrices(ticker: string): FlowPrices {
  const override = userData.settings.flow.overrides[ticker];
  const market = getMarketPrices(ticker);
  return {
    buy: override?.buy ?? market.buy,
    sell: override?.sell ?? market.sell,
    buyOverride: override?.buy !== undefined,
    sellOverride: override?.sell !== undefined,
  };
}

export function setFlowPriceOverride(ticker: string, side: PriceSide, price: number | undefined) {
  const overrides = userData.settings.flow.overrides;
  const override = { ...overrides[ticker], [side]: price };
  if (override.buy === undefined && override.sell === undefined) {
    delete overrides[ticker];
    return;
  }
  overrides[ticker] = override;
}
