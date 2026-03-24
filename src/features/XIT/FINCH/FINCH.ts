import FINCH from '@src/features/XIT/FINCH/FINCH.vue';

xit.add({
  command: ['FINCH'],
  name: 'Financial Charts',
  description: 'Financial charts for equity and assets.',
  optionalParameters: 'Chart Identifier',
  contextItems: () => [
    { cmd: 'XIT FIN' },
    { cmd: 'XIT FINBS' },
    { cmd: 'XIT FINPR' },
    { cmd: 'XIT SET FIN' },
  ],
  component: () => FINCH,
});
