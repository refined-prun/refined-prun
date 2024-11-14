import HEALTH from '@src/features/XIT/HEALTH.vue';

xit.add({
  command: 'HEALTH',
  name: 'DATA HEALTH',
  description: 'Shows statistics on collected data.',
  component: () => HEALTH,
});
