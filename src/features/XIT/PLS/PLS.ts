import PLS from '@src/features/XIT/PLS/PLS.vue';

xit.add({
  command: ['PLS', 'PLANETS'],
  name: 'PLANET SETTINGS',
  description: 'Per-planet settings for bases you own.',
  component: () => PLS,
  bufferSize: [700, 400],
});
