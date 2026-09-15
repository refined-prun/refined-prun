import '@src/features/XIT/ACT/actions/cx-buy/cx-buy';
import '@src/features/XIT/ACT/actions/mtra/mtra';

import GovBurnActWindow from '@src/features/XIT/GOVBURN/GovBurnActWindow.vue';
import { planetsStore } from '@src/infrastructure/prun-api/data/planets';

xit.add({
  command: 'GOVBURNACT',
  name: parameters => {
    // Support planet names with spaces.
    const parameter = parameters.join(' ');
    if (parameter) {
      const planet = planetsStore.find(parameter);
      return `GOVBURN RESUPPLY - ${planet?.name ?? parameter}`;
    }
    return 'GOVBURN RESUPPLY';
  },
  description: 'Executes a planetary upkeep resupply action package.',
  mandatoryParameters: 'Planet Identifier',
  component: () => GovBurnActWindow,
});
