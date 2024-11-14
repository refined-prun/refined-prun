import './shortcuts';
import WEB from '@src/features/XIT/WEB/WEB.vue';

xit.add({
  command: 'WEB',
  name: 'WEB PAGE',
  description: 'Opens a web page.',
  mandatoryParameters: 'Web page URL',
  component: () => WEB,
});
