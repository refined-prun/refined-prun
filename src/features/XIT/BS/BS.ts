import BS from '@src/features/XIT/BS/BS.vue';

xit.add({
  command: 'BS',
  name: 'BASE OVERVIEW',
  description: 'Lists all player bases with links to key base commands.',
  optionalParameters: 'Planet Identifier(s)',
  component: () => BS,
  bufferSize: [660, 300],
});
