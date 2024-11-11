import xit from '@src/features/XIT/xit-registry';
import CONTC from '@src/features/XIT/CONTC/CONTC.vue';

xit.add({
  command: ['CONTC'],
  name: 'PENDING CONTRACT CONDITIONS',
  component: () => CONTC,
});
