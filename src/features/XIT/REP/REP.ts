import REP from '@src/features/XIT/REP/REP.vue';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { getParameterSites } from './entries';

xit.add({
  command: ['REP', 'REPAIR', 'REPAIRS'],
  name: 'REPAIRS',
  description: 'Shows the materials to repair buildings.',
  optionalParameters: 'Planet Identifier(s)',
  contextItems: parameters => {
    const cmds = [{ cmd: 'BRA' }];
    // Sites will never be given empty parameter, which makes it always defined.
    const sites = getParameterSites(parameters)!;
    for (const site of sites) {
      cmds.push({ cmd: `BRA ${getEntityNaturalIdFromAddress(site.address)}` });
    }
    return cmds;
  },
  component: () => REP,
});
