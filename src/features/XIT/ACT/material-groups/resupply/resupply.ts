import { act } from '@src/features/XIT/ACT/act-registry';
import Edit from '@src/features/XIT/ACT/material-groups/resupply/Edit.vue';
import Configure from '@src/features/XIT/ACT/material-groups/resupply/Configure.vue';
import { Config } from '@src/features/XIT/ACT/material-groups/resupply/config';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { configurableValue } from '@src/features/XIT/ACT/shared-types';
import { computeResupplyBill } from '@src/features/XIT/ACT/material-groups/resupply/bill';
import { watchWhile } from '@src/utils/watch';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';

act.addMaterialGroup<Config>({
  type: 'Resupply',
  shortDescription: 'Calculate consumables needed based on burn rate',
  description: data => {
    if (!data.planet || data.days === undefined) {
      return '--';
    }

    const daysLabel = data.days === configurableValue ? '?' : data.days;
    return `Resupply ${data.planet} with ${daysLabel} day${data.days == 1 ? '' : 's'} of supplies`;
  },
  editComponent: Edit,
  configureComponent: Configure,
  needsConfigure: data => data.planet === configurableValue || data.days === configurableValue,
  isValidConfig: (data, config) =>
    (data.planet !== configurableValue || config.planet !== undefined) &&
    (data.days !== configurableValue || config.days !== undefined),
  generateMaterialBill: async ({ data, config, log, setStatus }) => {
    if (!data.planet) {
      log.error('Missing resupply planet');
    }
    if (data.days === undefined) {
      log.error('Missing resupply days');
    }

    const planet = data.planet === configurableValue ? config.planet : data.planet;
    const days =
      data.days === configurableValue
        ? (config.days ?? 10)
        : typeof data.days === 'number'
          ? data.days
          : parseFloat(data.days as string);
    const site = sitesStore.getByPlanetNaturalIdOrName(planet);
    if (!site) {
      log.error(`Base is not present on ${data.planet}`);
    }

    if (!site || days === undefined || isNaN(days)) {
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

    return computeResupplyBill(data, planet, days, config.materialFilter);
  },
});
