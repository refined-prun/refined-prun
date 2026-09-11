import PLNT from '@src/features/XIT/PLNT/PLNT.vue';

xit.add({
  command: ['PLNT', 'PLANETS'],
  name: 'PLANET SETTINGS',
  description: 'Per-planet settings for bases you own.',
  component: () => PLNT,
  bufferSize: [700, 400],
});
