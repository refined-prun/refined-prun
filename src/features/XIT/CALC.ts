import CALC from '@src/features/XIT/CALC.vue';

xit.add({
  command: ['CALC', 'CALCULATOR'],
  name: 'CALCULATOR',
  description: 'Provides an in-game calculator.',
  component: () => CALC,
  bufferSize: [275, 326],
});
