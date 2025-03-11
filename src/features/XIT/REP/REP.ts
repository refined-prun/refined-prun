import REP from '@src/features/XIT/REP/REP.vue';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { getParameterSites } from './entries';

xit.add({
  command: ['REP', 'REPAIR', 'REPAIRS'],
  name: 'REPAIRS',
  description: 'Shows the materials to repair buildings.',
  optionalParameters: 'Planet Identifier(s)',
  contextItems: (parameters: string[]) => {
    const cmds = [{ cmd: 'BRA' }];
    //sites will return [] if there are no parameters other than the command
    //All other parameters will make a context item and add it
    const sites = computed(() => getParameterSites(parameters));
    if (!sites || !sites.value) return cmds;
    sites.value.forEach(site => {
      cmds.push({ cmd: `BRA ${getEntityNaturalIdFromAddress(site.address)}` });
    });
    return cmds;
  },
  component: () => REP,
});
