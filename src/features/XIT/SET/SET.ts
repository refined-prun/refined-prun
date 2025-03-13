import PMMG from '@src/features/XIT/SET/PMMG.vue';
import SET from '@src/features/XIT/SET/SET.vue';

xit.add({
  command: ['SET', 'SETTINGS'],
  name: 'REFINED PRUN SETTINGS',
  description: 'Refined PrUn settings.',
  optionalParameters: 'Settings Tab Identifier',
  component: parameters => {
    switch (parameters[0]?.toUpperCase()) {
      case 'PMMG':
        return PMMG;
      default:
        return SET;
    }
  },
});
