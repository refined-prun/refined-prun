import { getPlanetBurn, PlanetBurn } from '@src/core/burn';
import { getPrice } from '@src/infrastructure/fio/cx';

export interface PlanetContribution {
  naturalId: string;
  planetName: string;
  amount: number;
}

export interface MaterialFlow {
  ticker: string;
  production: number;
  consumption: number;
  delta: number;
  price: number | undefined;
  currencyDelta: number | undefined;
  producers: PlanetContribution[];
  consumers: PlanetContribution[];
}

export function calculateMaterialFlow(
  burns: PlanetBurn[],
  price: (ticker: string) => number | undefined,
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
          price: undefined,
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
    flow.price = price(flow.ticker);
    flow.currencyDelta = flow.price === undefined ? undefined : flow.delta * flow.price;
    flow.producers.sort((a, b) => b.amount - a.amount);
    flow.consumers.sort((a, b) => b.amount - a.amount);
    result.push(flow);
  }
  return result;
}

// Sites whose production or workforce data hasn't arrived yet are omitted.
export function getMaterialFlow(sites: PrunApi.Site[]) {
  const burns = sites.map(getPlanetBurn).filter(x => x !== undefined);
  return calculateMaterialFlow(burns, getPrice);
}
