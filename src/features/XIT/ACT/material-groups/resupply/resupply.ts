import { act } from '@src/features/XIT/ACT/act-registry';
import Edit from '@src/features/XIT/ACT/material-groups/resupply/Edit.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { calculatePlanetBurn } from '@src/core/burn';
import { watchWhile } from '@src/utils/watch';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';

act.addMaterialGroup({
  type: 'Resupply',
  description: group => {
    if (!group.planet || !group.days) {
      return '--';
    }

    return `Resupply ${group.planet} with ${group.days} day${group.days == 1 ? '' : 's'} of supplies`;
  },
  editComponent: Edit,
  generateMaterialBill: async ({ data, log, setStatus }) => {
    if (!data.planet) {
      log.error('Missing resupply planet');
    }
    if (!data.days) {
      log.error('Missing resupply days');
    }

    const exclusions = data.exclusions ?? [];
    const site = sitesStore.getByPlanetNaturalIdOrName(data.planet);
    if (!site) {
      log.error(`Base is not present on ${data.planet}`);
    }

    if (!site || !data.days) {
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

    const parsedGroup = {};
    const planetBurn = calculatePlanetBurn(
      data.consumablesOnly ? undefined : production.value,
      workforce.value,
      stores,
    );

    for (const mat of Object.keys(planetBurn)) {
      if (planetBurn[mat].DailyAmount < 0) {
        // Consuming not producing
        const days = typeof data.days === 'number' ? data.days : parseFloat(data.days);
        let amount = Math.ceil(-planetBurn[mat].DailyAmount * days);
        if (data.useBaseInv) {
          amount -= planetBurn[mat].Inventory;
        }

        if (amount > 0 && !exclusions.includes(mat)) {
          parsedGroup[mat] = amount;
        }
      }
    }
    return parsedGroup;
  },
});
