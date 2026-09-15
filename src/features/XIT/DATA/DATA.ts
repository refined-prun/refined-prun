import DATA from '@src/features/XIT/DATA/DATA.vue';

xit.add({
  command: 'DATA',
  name: 'DATA EXPLORER',
  description: 'Explores in-memory Refined PrUn game and tile data.',
  optionalParameters: 'Source ID, JSON',
  component: () => DATA,
  bufferSize: [1080, 720],
});
