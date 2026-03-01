import { act } from '@src/features/XIT/ACT/act-registry';
import Edit from '@src/features/XIT/ACT/material-groups/paste/Edit.vue';
import Configure from '@src/features/XIT/ACT/material-groups/paste/Configure.vue';
import { Config } from '@src/features/XIT/ACT/material-groups/paste/config';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

interface ParseResult {
  materials: Record<string, number>;
  prices?: Record<string, number>;
}

function isValidPrice(n: number): boolean {
  if (n <= 0 || !isFinite(n)) {
    return false;
  }
  // At most 2 fractional digits.
  if (Math.round(n * 100) !== n * 100) {
    return false;
  }
  return true;
}

export function parseMaterials(input: string | undefined): ParseResult | undefined {
  if (!input) {
    return undefined;
  }
  const lines = input.split('\n').filter(x => x.trim().length > 0);
  if (lines.length === 0) {
    return undefined;
  }
  const materials: Record<string, number> = {};
  let prices: Record<string, number> | undefined;
  let hasPrice = false;
  for (const line of lines) {
    const parts = line.split(/[,\t]/).map(x => x.trim());
    if (parts.length < 2 || parts.length > 3) {
      return undefined;
    }
    const [ticker, amountStr] = parts;
    const material = materialsStore.getByTicker(ticker.toUpperCase());
    if (!material) {
      return undefined;
    }
    const amount = Number(amountStr);
    if (!Number.isInteger(amount) || amount <= 0) {
      return undefined;
    }
    materials[material.ticker] = (materials[material.ticker] ?? 0) + amount;

    if (parts.length === 3) {
      const price = Number(parts[2]);
      if (!isValidPrice(price)) {
        return undefined;
      }
      if (!prices) {
        prices = {};
      }
      prices[material.ticker] = price;
      hasPrice = true;
    } else if (hasPrice) {
      // Mixed rows: some have prices, some don't — invalid.
      return undefined;
    }
  }
  return { materials, prices };
}

act.addMaterialGroup<Config>({
  type: 'Paste',
  description: () => {
    return 'Paste materials at execution time';
  },
  editComponent: Edit,
  configureComponent: Configure,
  needsConfigure: () => true,
  isValidConfig: (_data, config) => parseMaterials(config.materials) !== undefined,
  generateMaterialBill: async ({ config, log, setPrices }) => {
    const result = parseMaterials(config.materials);
    if (!result) {
      log.error('Invalid or missing pasted materials.');
      return undefined;
    }
    if (result.prices) {
      setPrices(result.prices);
    }
    return result.materials;
  },
});
