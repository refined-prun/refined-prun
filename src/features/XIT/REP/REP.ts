import xit from '@src/features/XIT/xit-registry';
import REP from '@src/features/XIT/REP/REP.vue';

xit.add({
  command: ['REP', 'REPAIR', 'REPAIRS'],
  name: 'REPAIRS',
  component: () => REP,
});
