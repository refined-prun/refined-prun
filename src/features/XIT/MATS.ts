import MATS from '@src/features/XIT/MATS.vue';

xit.add({
  command: 'MATS',
  name: 'MATERIALS',
  description: 'List of materials.',
  optionalParameters: 'Material Category or Ticker(s)',
  component: () => MATS,
});
