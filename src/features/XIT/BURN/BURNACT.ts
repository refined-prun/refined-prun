import '@src/features/XIT/ACT/actions/cx-buy/cx-buy';
import '@src/features/XIT/ACT/actions/mtra/mtra';
import '@src/features/XIT/ACT/material-groups/resupply/resupply';

import BurnActWindow from '@src/features/XIT/BURN/BurnActWindow.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';

xit.add({
  command: 'BURNACT',
  name: parameters => {
    if (parameters[0]) {
      const site = sitesStore.getByPlanetNaturalIdOrName(parameters[0]);
      const name = site ? getEntityNameFromAddress(site.address) : parameters[0];
      return `BURN RESUPPLY - ${name}`;
    }
    return 'BURN RESUPPLY';
  },
  description: 'Executes a resupply action package for a planet from the burn screen.',
  component: () => BurnActWindow,
});
