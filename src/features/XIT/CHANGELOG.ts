import CHANGELOG from '@src/features/XIT/CHANGELOG.vue';

xit.add({
  command: ['CHLG', 'CHANGELOG'],
  name: 'CHANGELOG',
  description: 'Most recent changelog for Refined PrUn',
  component: () => CHANGELOG,
});
