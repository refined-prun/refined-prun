import FLOW from '@src/features/XIT/FLOW/FLOW.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';

xit.add({
  command: 'FLOW',
  name: parameters => {
    if (parameters[0] && !parameters[1]) {
      const site = sitesStore.getByPlanetNaturalIdOrName(parameters[0]);
      if (site) {
        const name = getEntityNameFromAddress(site.address);
        return `MATERIAL FLOW - ${name}`;
      }
    }

    return 'MATERIAL FLOW';
  },
  description: 'Shows daily production, consumption and value of each material across bases.',
  optionalParameters: 'Planet Identifier(s), NOT',
  contextItems: () => [{ cmd: 'XIT BURN' }, { cmd: 'XIT FINPR' }, { cmd: 'XIT SET FIN' }],
  component: () => FLOW,
  bufferSize: [900, 500],
});
