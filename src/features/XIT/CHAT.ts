import xit from '@src/features/XIT/xit-registry';
import CHAT from '@src/features/XIT/CHAT.vue';

xit.add({
  command: 'CHAT',
  name: 'FIO CHAT',
  component: () => CHAT,
});
