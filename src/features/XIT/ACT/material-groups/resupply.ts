import { act } from '@src/features/XIT/ACT/act-registry';
import Resupply from '@src/features/XIT/ACT/material-groups/Resupply.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { calculatePlanetBurn } from '@src/core/burn';

act.addMaterialGroup({
  type: 'Resupply',
  description: group => {
    if (!group.planet || !group.days) {
      return '--';
    }

    return `Resupply ${group.planet} with ${group.days} day${group.days == 1 ? '' : 's'} of supplies`;
  },
  generateMaterialBill: group => {
    if (!group.planet) {
      return 'Missing resupply planet';
    }
    if (!group.days) {
      return 'Missing resupply days';
    }

    const exclusions = group.exclusions ?? [];
    const site = sitesStore.getByPlanetNaturalIdOrName(group.planet);
    const workforce = workforcesStore.getById(site?.siteId)?.workforces;
    if (!workforce) {
      return 'Missing burn data';
    }

    const production = group.consumablesOnly
      ? undefined
      : productionStore.getBySiteId(site?.siteId);
    const stores = storagesStore.getByAddressableId(site?.siteId);

    const parsedGroup = {};
    const planetBurn = calculatePlanetBurn(production, workforce, stores);

    for (const mat of Object.keys(planetBurn)) {
      if (planetBurn[mat].DailyAmount < 0) {
        // Consuming not producing
        const days = typeof group.days === 'number' ? group.days : parseFloat(group.days);
        let amount = Math.ceil(-planetBurn[mat].DailyAmount * days);
        if (group.useBaseInv) {
          amount -= planetBurn[mat].Inventory;
        }

        if (amount > 0 && !exclusions.includes(mat)) {
          parsedGroup[mat] = amount;
        }
      }
    }
    return parsedGroup;
  },
  editForm: Resupply,
});
