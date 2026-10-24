import CXOS from '@src/features/XIT/CXOS/CXOS.vue';

xit.add({
  command: ['CXOS'],
  name: 'TRADE OVERVIEW',
  description: 'Overview of recent CX trades, restock suggestions, and market quick-links.',
  component: () => CXOS,
});
