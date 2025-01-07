import CONTC from '@src/features/XIT/CONTC/CONTC.vue';

xit.add({
  command: ['CONTC'],
  name: 'PENDING CONTRACT CONDITIONS',
  description: 'Displays pending contract conditions.',
  contextItems: () => [{ cmd: 'XIT CONTS' }, { cmd: 'CONTS' }, { cmd: 'CONTD' }],
  component: () => CONTC,
});
