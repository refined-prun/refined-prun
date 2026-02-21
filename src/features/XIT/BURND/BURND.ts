import BURND from '@src/features/XIT/BURND/BURND.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';

xit.add({
  command: 'BURND',
  name: parameters => {
    if (parameters[0] && !parameters[1]) {
      const site = sitesStore.getByPlanetNaturalIdOrName(parameters[0]);
      if (site) {
        const name = getEntityNameFromAddress(site.address);
        return `BURN DATA EXPORT - ${name}`;
      }
    }

    return 'BURN DATA EXPORT';
  },
  description: 'Export burn data as tab-separated text for spreadsheets.',
  optionalParameters: 'Planet Identifier(s), OVERALL, NOT',
  component: () => BURND,
});
