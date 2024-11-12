import FINPR from '@src/features/XIT/FIN/FINPR.vue';

xit.add({
  command: ['FINPR'],
  name: 'Profitability Report',
  contextItems: () => [{ cmd: 'XIT FIN' }, { cmd: 'XIT FINCH' }, { cmd: 'XIT SET FIN' }],
  component: () => FINPR,
});
