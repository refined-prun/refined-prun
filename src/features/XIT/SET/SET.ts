import PMMG from '@src/features/XIT/SET/PMMG.vue';
import SET from '@src/features/XIT/SET/SET.vue';

xit.add({
  command: ['SET', 'SETTINGS'],
  name: 'REFINED PRUN SETTINGS',
  component: parameters => {
    switch (parameters[1]?.toUpperCase()) {
      case 'PMMG':
        return PMMG;
      default:
        return SET;
    }
  },
});
