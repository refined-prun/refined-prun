import NOTE from '@src/features/XIT/NOTE/NOTE.vue';

xit.add({
  command: ['NOTE', 'NOTES'],
  name: 'NOTE',
  description: 'Note-taking tool.',
  optionalParameters: 'Note Identifier or Name',
  component: () => NOTE,
});
