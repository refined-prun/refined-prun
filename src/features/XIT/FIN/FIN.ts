import FIN from '@src/features/XIT/FIN/FIN.vue';

xit.add({
  command: ['FIN'],
  name: 'Financial overview',
  contextItems: () => [{ cmd: 'XIT FINPR' }, { cmd: 'XIT FINCH' }, { cmd: 'XIT SET FIN' }],
  component: () => FIN,
});
