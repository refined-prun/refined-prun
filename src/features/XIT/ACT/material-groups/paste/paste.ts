import { act } from '@src/features/XIT/ACT/act-registry';
import Configure from '@src/features/XIT/ACT/material-groups/paste/Configure.vue';
import { Config } from '@src/features/XIT/ACT/material-groups/paste/config';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

function stripQuotes(s: string) {
  if (s.length >= 2 && s[0] === '"' && s[s.length - 1] === '"') {
    return s.slice(1, -1);
  }
  return s;
}

// Strip thousand-separator commas: "1,600" → "1600".
function stripThousands(s: string) {
  return s.replace(/,/g, '');
}

interface SplitResult {
  parts: string[];
  isTabSeparated: boolean;
}

function splitLine(line: string): SplitResult {
  // Tab-separated (from spreadsheets) takes priority.
  if (line.includes('\t')) {
    return {
      parts: line.split('\t').map(x => stripQuotes(x.trim())),
      isTabSeparated: true,
    };
  }
  return {
    parts: line.split(',').map(x => stripQuotes(x.trim())),
    isTabSeparated: false,
  };
}

function parseAmount(value: string, isTabSeparated: boolean) {
  // Only strip thousand-separator commas in tab-separated data,
  // where commas are unambiguously inside values.
  return Number(isTabSeparated ? stripThousands(value) : value);
}

export function parseMaterials(input: string | undefined): Record<string, number> | undefined {
  if (!input) {
    return undefined;
  }
  const lines = input.split('\n').filter(x => x.trim().length > 0);
  if (lines.length === 0) {
    return undefined;
  }
  const materials: Record<string, number> = {};
  for (const line of lines) {
    const { parts, isTabSeparated } = splitLine(line);
    if (parts.length !== 2) {
      return undefined;
    }
    const [ticker, amountStr] = parts;
    const material = materialsStore.getByTicker(ticker.toUpperCase());
    if (!material) {
      return undefined;
    }
    const amount = parseAmount(amountStr, isTabSeparated);
    if (!Number.isFinite(amount) || amount <= 0 || Math.floor(amount) !== amount) {
      return undefined;
    }
    materials[material.ticker] = (materials[material.ticker] ?? 0) + amount;
  }
  return materials;
}

act.addMaterialGroup<Config>({
  type: 'Paste',
  shortDescription: 'Paste materials from clipboard at execution time',
  description: () => 'Paste materials at execution time',
  configureComponent: Configure,
  needsConfigure: () => true,
  isValidConfig: (_data, config) => parseMaterials(config.materials) !== undefined,
  generateMaterialBill: async ({ config, log }) => {
    const materials = parseMaterials(config.materials);
    if (!materials) {
      log.error('Invalid or missing pasted materials.');
      return undefined;
    }
    return materials;
  },
});
