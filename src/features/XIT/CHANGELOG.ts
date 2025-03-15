import CHANGELOG from '@src/features/XIT/CHANGELOG.vue';

xit.add({
  command: ['CHLG', 'CHANGELOG'],
  name: 'CHANGELOG',
  description: 'Shows the most recent changelog for Refined PrUn',
  component: () => CHANGELOG,
});
