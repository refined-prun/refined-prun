import BURN from '@src/features/XIT/BURN/BURN.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';

xit.add({
  command: 'BURN',
  name: parameters => {
    if (parameters[0] && !parameters[1]) {
      const site = sitesStore.getByPlanetNaturalIdOrName(parameters[0]);
      if (site) {
        const name = getEntityNameFromAddress(site.address);
        return `ENHANCED BURN - ${name}`;
      }
    }

    return 'ENHANCED BURN';
  },
  description: 'Shows the number of days of consumables left.',
  optionalParameters: 'Planet Identifier(s)',
  component: () => BURN,
});
