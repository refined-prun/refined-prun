import CONTS from '@src/features/XIT/CONTS/CONTS.vue';

xit.add({
  command: ['CONTS', 'CONTRACTS'],
  name: 'ACTIVE CONTRACTS',
  description: 'Displays active contracts.',
  contextItems: () => [{ cmd: 'XIT CONTC' }, { cmd: 'CONTS' }, { cmd: 'CONTD' }],
  component: () => CONTS,
});
