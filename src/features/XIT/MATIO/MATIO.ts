import MATIO from '@src/features/XIT/MATIO/MATIO.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';

xit.add({
  command: 'MATIO',
  name: parameters => {
    if (parameters[0] && !parameters[1]) {
      const site = sitesStore.getByPlanetNaturalIdOrName(parameters[0]);
      if (site) {
        const name = getEntityNameFromAddress(site.address);
        return `MATERIAL IN/OUT - ${name}`;
      }
    }

    return 'MATERIALS IN/OUT';
  },
  description: 'Daily material input/output flow.',
  optionalParameters: 'Planet Identifier(s), OVERALL, NOT',
  component: () => MATIO,
});
