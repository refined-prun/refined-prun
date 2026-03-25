import { act } from '@src/features/XIT/ACT/act-registry';
import Edit from '@src/features/XIT/ACT/material-groups/stock/Edit.vue';
import Configure from '@src/features/XIT/ACT/material-groups/stock/Configure.vue';
import { Config } from '@src/features/XIT/ACT/material-groups/stock/config';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { configurableValue } from '@src/features/XIT/ACT/shared-types';
import { fixed0 } from '@src/utils/format';

act.addMaterialGroup<Config>({
  type: 'Stock',
  description: data => {
    const materials = data.materials;
    if (!materials || Object.keys(materials).length === 0) {
      if (!data.planet) {
        return '--';
      }
      return 'Stock on ' + data.planet;
    }
    const items = Object.keys(materials)
      .map(ticker => `${fixed0(materials[ticker])} ${ticker}`)
      .join(', ');
    if (data.planet) {
      return `Stock ${items} on ${data.planet}`;
    }
    return `Stock ${items}`;
  },
  editComponent: Edit,
  configureComponent: Configure,
  needsConfigure: data => data.planet === configurableValue,
  isValidConfig: (data, config) => data.planet !== configurableValue || config.planet !== undefined,
  generateMaterialBill: async ({ data, config, log }) => {
    if (!data.planet) {
      log.error('Missing stock planet');
      return undefined;
    }
    const materials = data.materials;
    if (!materials || Object.keys(materials).length === 0) {
      log.error('Missing materials.');
      return undefined;
    }

    const planet = data.planet === configurableValue ? config.planet : data.planet;
    const site = sitesStore.getByPlanetNaturalIdOrName(planet);
    if (!site) {
      log.error(`Base is not present on ${planet}`);
      return undefined;
    }

    const stores = storagesStore.getByAddressableId(site.siteId);
    const inventory = new Map<string, number>();
    if (stores) {
      for (const store of stores) {
        for (const item of store.items) {
          if (!item.quantity) {
            continue;
          }
          const ticker = item.quantity.material.ticker;
          const existing = inventory.get(ticker) ?? 0;
          inventory.set(ticker, existing + item.quantity.amount);
        }
      }
    }

    const parsedGroup: Record<string, number> = {};
    for (const [ticker, targetAmount] of Object.entries(materials)) {
      if (targetAmount <= 0) {
        continue;
      }
      const currentAmount = inventory.get(ticker) ?? 0;
      const needed = targetAmount - currentAmount;
      if (needed > 0) {
        parsedGroup[ticker] = needed;
      }
    }

    return parsedGroup;
  },
});
