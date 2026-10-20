import SHPT from '@src/features/XIT/SHPT/SHPT.vue';

xit.add({
  command: 'SHPT',
  name: 'SHIPPING CONTRACTS',
  description: 'Shows the most profitable shipping ads for each docked ship.',
  component: () => SHPT,
});
