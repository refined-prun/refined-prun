import GIF from '@src/features/XIT/GIF.vue';

xit.add({
  command: 'GIF',
  name: 'RANDOM GIF',
  description: 'Displays a random gif.',
  optionalParameters: 'Gif Category',
  component: () => GIF,
});
