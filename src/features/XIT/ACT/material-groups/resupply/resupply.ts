import { act } from '@src/features/XIT/ACT/act-registry';
import Edit from '@src/features/XIT/ACT/material-groups/resupply/Edit.vue';
import Configure from '@src/features/XIT/ACT/material-groups/resupply/Configure.vue';
import { Config } from '@src/features/XIT/ACT/material-groups/resupply/config';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { configurableValue } from '@src/features/XIT/ACT/shared-types';
import { calculatePlanetBurn } from '@src/core/burn';
import { watchWhile } from '@src/utils/watch';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';

act.addMaterialGroup<Config>({
  type: 'Resupply',
  description: data => {
    if (!data.planet || data.days === undefined) {
      return '--';
    }

    return `Resupply ${data.planet} with ${data.days} day${data.days == 1 ? '' : 's'} of supplies`;
  },
  editComponent: Edit,
  configureComponent: Configure,
  needsConfigure: data => data.planet === configurableValue,
  isValidConfig: (data, config) => data.planet !== configurableValue || config.planet !== undefined,
  generateMaterialBill: async ({ data, config, log, setStatus }) => {
    if (!data.planet) {
      log.error('Missing resupply planet');
    }
    if (data.days === undefined) {
      log.error('Missing resupply days');
    }

    const exclusions = data.exclusions ?? [];
    const planet = data.planet === configurableValue ? config.planet : data.planet;
    const site = sitesStore.getByPlanetNaturalIdOrName(planet);
    if (!site) {
      log.error(`Base is not present on ${data.planet}`);
    }

    if (!site || data.days === undefined) {
      return undefined;
    }

    const workforce = computed(() => workforcesStore.getById(site?.siteId)?.workforces);
    const production = computed(() => productionStore.getBySiteId(site.siteId));
    if (workforce.value === undefined || production.value === undefined) {
      const name =
        getEntityNameFromAddress(site.address) ?? getEntityNaturalIdFromAddress(site.address);
      setStatus(`Loading ${name} burn data...`);
      await watchWhile(
        toRef(() => workforce.value === undefined || production.value === undefined),
      );
    }
    const stores = storagesStore.getByAddressableId(site.siteId);

    const planetBurn = calculatePlanetBurn(
      data.consumablesOnly ? undefined : production.value,
      workforce.value,
      (data.useBaseInv ?? true) ? stores : undefined,
    );

    const parsedGroup = {};
    for (const ticker of Object.keys(planetBurn)) {
      if (exclusions.includes(ticker)) {
        continue;
      }
      const matBurn = planetBurn[ticker];
      if (matBurn.dailyAmount >= 0) {
        continue;
      }
      const days = typeof data.days === 'number' ? data.days : parseFloat(data.days);
      const need = Math.ceil((matBurn.daysLeft - days) * matBurn.dailyAmount);
      if (need > 0) {
        parsedGroup[ticker] = need;
      }
    }
    return parsedGroup;
  },
});
