import FINPR from '@src/features/XIT/FIN/FINPR.vue';

xit.add({
  command: ['FINPR'],
  name: 'Profitability Report',
  description: 'Base profitability report.',
  contextItems: () => [
    { cmd: 'XIT FIN' },
    { cmd: 'XIT FINBS' },
    { cmd: 'XIT FINCH' },
    { cmd: 'XIT SET FIN' },
  ],
  component: () => FINPR,
});
