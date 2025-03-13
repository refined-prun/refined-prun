import REP from '@src/features/XIT/REP/REP.vue';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { getParameterSites } from './entries';

xit.add({
  command: ['REP', 'REPAIR', 'REPAIRS'],
  name: 'REPAIRS',
  description: 'Shows the materials to repair buildings.',
  optionalParameters: 'Planet Identifier(s)',
  contextItems: parameters => {
    if (parameters.length === 0) {
      return [{ cmd: 'BRA' }];
    }
    const sites = getParameterSites(parameters) ?? [];
    return sites.map(x => ({ cmd: `BRA ${getEntityNaturalIdFromAddress(x.address)}` }));
  },
  component: () => REP,
});
