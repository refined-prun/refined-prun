import FINCH from '@src/features/XIT/FINCH/FINCH.vue';

xit.add({
  command: ['FINCH'],
  name: 'Financial Charts',
  contextItems: () => [{ cmd: 'XIT FIN' }, { cmd: 'XIT FINPR' }, { cmd: 'XIT SET FIN' }],
  component: () => FINCH,
});
