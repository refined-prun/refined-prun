import HELP from '@src/features/XIT/HELP.vue';

xit.add({
  command: 'HELP',
  name: 'HELP',
  description: 'Useful information to get started with Refined PrUn.',
  optionalParameters: 'ACTION',
  component: () => HELP,
});
