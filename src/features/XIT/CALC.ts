import xit from '@src/features/XIT/xit-registry';
import CALC from '@src/features/XIT/CALC.vue';

xit.add({
  command: ['CALC', 'CALCULATOR'],
  name: 'CALCULATOR',
  component: () => CALC,
});
