import FXTS from '@src/features/XIT/FXTS/FXTS.vue';

xit.add({
  command: ['FXTS'],
  name: 'FOREIGN EXCHANGE TRADES',
  description: 'List of all your foreign exchange trades.',
  component: () => FXTS,
});
