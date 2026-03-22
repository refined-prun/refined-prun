import PROD from '@src/features/XIT/PROD/PROD.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';

xit.add({
  command: 'PROD',

  name: parameters => {
    if (parameters[0] && !parameters[1]) {
      const site = sitesStore.getByPlanetNaturalIdOrName(parameters[0]);
      if (site) {
        const name = getEntityNameFromAddress(site.address);
        return `PRODUCTION OVERVIEW - ${name}`;
      }
    }

    return 'PRODUCTION OVERVIEW';
  },
  description: 'Dense cross-base production overview.',
  optionalParameters: 'Planet Identifier(s), OVERALL, NOT',
  component: () => PROD,
});
