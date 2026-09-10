import FIN from '@src/features/XIT/FIN/FIN.vue';

xit.add({
  command: ['FIN'],
  name: 'Financial overview',
  description: 'Basic financial overview and inventory breakdown.',
  contextItems: () => [
    { cmd: 'XIT FINBS' },
    { cmd: 'XIT FINPR' },
    { cmd: 'XIT FINCH' },
    { cmd: 'XIT SET FIN' },
  ],
  component: () => FIN,
});
