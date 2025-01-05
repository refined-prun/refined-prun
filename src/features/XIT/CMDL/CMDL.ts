import CMDL from '@src/features/XIT/CMDL/CMDL.vue';

xit.add({
  command: 'CMDL',
  name: 'COMMAND LISTS',
  description: 'Provides a customizable list of command links.',
  optionalParameters: 'List Identifier or Name',
  component: () => CMDL,
});
