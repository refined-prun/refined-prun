import BURN from '@src/features/XIT/BURN/BURN.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';

xit.add({
  command: 'BURN',
  name: parameters => {
    if (parameters[1] && !parameters[2]) {
      const site = sitesStore.getByPlanetNaturalIdOrName(parameters[1]);
      if (site) {
        const name = getEntityNameFromAddress(site.address);
        return `ENHANCED BURN - ${name}`;
      }
    }

    return 'ENHANCED BURN';
  },
  component: () => BURN,
});
