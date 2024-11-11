import xit from '@src/features/XIT/xit-registry';
import FIN from '@src/features/XIT/SET/FIN.vue';
import PMMG from '@src/features/XIT/SET/PMMG.vue';
import SET from '@src/features/XIT/SET/SET.vue';

xit.add({
  command: ['SET', 'SETTINGS'],
  name: 'REFINED PRUN SETTINGS',
  component: parameters => {
    switch (parameters[1]?.toUpperCase()) {
      case 'FIN':
        return FIN;
      case 'PMMG':
        return PMMG;
      default:
        return SET;
    }
  },
});
