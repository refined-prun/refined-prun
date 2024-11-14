import FINBS from '@src/features/XIT/FINBS/FINBS.vue';

xit.add({
  command: ['FINBS'],
  name: 'Balance Statement',
  description: 'Balance statement showing your assets and liabilities.',
  contextItems: () => [{ cmd: 'XIT FIN' }, { cmd: 'XIT FINPR' }, { cmd: 'XIT SET FIN' }],
  component: () => FINBS,
});
