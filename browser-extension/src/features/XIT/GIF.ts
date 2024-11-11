import xit from '@src/features/XIT/xit-registry';
import GIF from '@src/features/XIT/GIF.vue';

xit.add({
  command: 'GIF',
  name: 'RANDOM GIF',
  component: () => GIF,
});
