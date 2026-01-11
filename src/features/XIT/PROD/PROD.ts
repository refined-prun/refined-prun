import PROD from '@src/features/XIT/PROD/PROD.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';

xit.add({
  command: ['PROD', 'PRODUCTION'],

  name: parameters => {
    if (parameters[0] && !parameters[1]) {
      const site = sitesStore.getByPlanetNaturalIdOrName(parameters[0]);
      if (site) {
        const name = getEntityNameFromAddress(site.address);
        return `ENHANCED PRODUCTION - ${name}`;
      }
    }

    return 'ENHANCED PRODUCTION';
  },
  description: 'Provides an in-game production.',
  component: () => PROD,
  bufferSize: [275, 326],
});
