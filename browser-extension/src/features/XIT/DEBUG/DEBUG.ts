import xit from '@src/features/XIT/xit-registry';
import DEBUG from '@src/features/XIT/DEBUG/DEBUG.vue';

xit.add({
  command: 'DEBUG',
  name: 'DEBUG',
  component: () => DEBUG,
});
