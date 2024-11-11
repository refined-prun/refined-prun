import xit from '@src/features/XIT/xit-registry';
import FINBS from '@src/features/XIT/FINBS/FINBS.vue';

xit.add({
  command: ['FINBS'],
  name: 'Balance Statement',
  contextItems: () => [{ cmd: 'XIT FIN' }, { cmd: 'XIT FINPR' }, { cmd: 'XIT SET FIN' }],
  component: () => FINBS,
});
