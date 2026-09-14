import '@src/features/XIT/ACT/actions/cx-buy/cx-buy';
import '@src/features/XIT/ACT/actions/mtra/mtra';
import '@src/features/XIT/ACT/material-groups/repair/repair';

import RepairActWindow from '@src/features/XIT/REP/RepairActWindow.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';

xit.add({
  command: 'REPAIRACT',
  name: parameters => {
    if (parameters[0]) {
      const site = sitesStore.getByPlanetNaturalIdOrName(parameters[0]);
      const name = site ? getEntityNameFromAddress(site.address) : parameters[0];
      return `REPAIR ACTION - ${name}`;
    }
    return 'REPAIR ACTION';
  },
  description: 'Executes a repair action package for a planet using XIT REP settings.',
  mandatoryParameters: 'Planet Identifier',
  component: () => RepairActWindow,
});
