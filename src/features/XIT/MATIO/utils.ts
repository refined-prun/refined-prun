import { MaterialBurn, PlanetBurn } from '@src/core/burn';
import { cxStore } from '@src/infrastructure/fio/cx';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { sortMaterials } from '@src/core/sort-materials';
import { fixed0, fixed1, fixed2 } from '@src/utils/format';

const exchanges = ['AI1', 'CI1', 'IC1', 'NC1', 'PrUn'] as const;
const methods = ['VWAP7d', 'VWAP30d'] as const;

export const pricingOptions = exchanges.flatMap(exchange =>
  methods.map(method => `${exchange} ${method}`),
);

export type MatioMode = 'all' | 'production' | 'workforce';
export type MatioPricingExchange = (typeof exchanges)[number];
export type MatioPricingMethod = (typeof methods)[number];
export type MatioPricing = {
  exchange: MatioPricingExchange;
  method: MatioPricingMethod;
};
export type MatioMaterialFlow = Pick<
  MaterialBurn,
  'input' | 'output' | 'dailyAmount' | 'workforce'
>;

export const defaultPricing: MatioPricing = {
  exchange: 'PrUn',
  method: 'VWAP7d',
};

const pricingKey = (pricing: MatioPricing) => `${pricing.exchange} ${pricing.method}`;
const isValidPricing = (pricing: Partial<Record<keyof MatioPricing, string>>) =>
  exchanges.includes(pricing.exchange as MatioPricingExchange) &&
  methods.includes(pricing.method as MatioPricingMethod);

export function normalizePricing(
  pricing?: Partial<Record<keyof MatioPricing, string>> | null,
): MatioPricing {
  if (!pricing?.exchange || !pricing?.method) {
    return defaultPricing;
  }

  return isValidPricing(pricing)
    ? {
        exchange: pricing.exchange as MatioPricingExchange,
        method: pricing.method as MatioPricingMethod,
      }
    : defaultPricing;
}

export function pricingToOptionValue(pricing: MatioPricing) {
  return pricingKey(normalizePricing(pricing));
}

export function pricingFromOptionValue(option?: string) {
  if (!option) {
    return undefined;
  }

  const [exchange, method] = option.split(' ');
  return normalizePricing({ exchange, method });
}

export function getPriceForPricing(ticker: string, pricing: MatioPricing) {
  if (!cxStore.fetched) {
    return undefined;
  }

  const exchangeCode = pricing.exchange === 'PrUn' ? 'UNIVERSE' : pricing.exchange;
  const tickerInfo = cxStore.prices.get(exchangeCode)?.get(ticker);
  if (!tickerInfo) {
    return undefined;
  }

  return (pricing.method === 'VWAP7d' ? tickerInfo.VWAP7D : tickerInfo.VWAP30D) ?? undefined;
}

export function formatFlowAmount(value: number): string {
  const abs = Math.abs(value);
  const precision = abs >= 1000 ? 0 : abs >= 100 ? 1 : 2;
  const rounded = Number(value.toFixed(precision));
  if (rounded === 0) {
    return '0';
  }

  const roundedAbs = Math.abs(rounded);
  if (roundedAbs >= 1000) {
    return fixed0(rounded);
  }
  if (roundedAbs >= 100) {
    return fixed1(rounded);
  }
  return fixed2(rounded);
}

export function getSortedTickers(burn: PlanetBurn) {
  const materials = Object.keys(burn.burn).map(materialsStore.getByTicker);
  return sortMaterials(materials.filter(x => x !== undefined));
}

export function matchesMode(flow: MatioMaterialFlow, mode: MatioMode) {
  switch (mode) {
    case 'production':
      return flow.input > 0 || flow.output > 0;
    case 'workforce':
      return flow.workforce > 0;
    default:
      return true;
  }
}
