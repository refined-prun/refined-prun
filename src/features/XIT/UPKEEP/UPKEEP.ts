import { sitesStore } from '@src/infrastructure/prun-api/data/sites.ts';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses.ts';
import UPKEEP from '@src/features/XIT/UPKEEP/UPKEEP.vue';

xit.add({
  command: ['UPKEEP', 'UPKEEPS'],
  name: parameters => {
    if (parameters[0] && !parameters[1]) {
      const site = sitesStore.getByPlanetNaturalIdOrName(parameters[0]);
      if (site) {
        const name = getEntityNameFromAddress(site.address);
        return `UPKEEP - ${name}`;
      }
    }

    return 'UPKEEP';
  },
  description: 'Configure custom upkeep costs.',
  optionalParameters: 'Planet Identifier(s), OVERALL',
  component: () => UPKEEP,
});
