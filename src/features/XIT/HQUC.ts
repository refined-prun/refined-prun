import xit from '@src/features/XIT/xit-registry';
import HQUC from '@src/features/XIT/HQUC.vue';

xit.add({
  command: ['HQUC'],
  name: 'HQ UPGRADE CALCULATOR',
  component: () => HQUC,
});
