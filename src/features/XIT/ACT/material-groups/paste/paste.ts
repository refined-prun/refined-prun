import { act } from '@src/features/XIT/ACT/act-registry';
import Configure from '@src/features/XIT/ACT/material-groups/paste/Configure.vue';
import { Config } from '@src/features/XIT/ACT/material-groups/paste/config';
import {
  parseMaterials,
  ResolveTicker,
} from '@src/features/XIT/ACT/material-groups/paste/paste-parse';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

export const resolveTicker: ResolveTicker = ticker => materialsStore.getByTicker(ticker)?.ticker;

act.addMaterialGroup<Config>({
  type: 'Paste',
  shortDescription: 'Paste materials from clipboard at execution time',
  description: () => {
    return 'Paste materials at execution time';
  },
  configureComponent: Configure,
  needsConfigure: () => true,
  isValidConfig: (_data, config) => parseMaterials(config.materials, resolveTicker) !== undefined,
  generateMaterialBill: async ({ config, log }) => {
    const result = parseMaterials(config.materials, resolveTicker);
    if (!result) {
      log.error('Invalid or missing pasted materials.');
      return undefined;
    }
    return result;
  },
});
