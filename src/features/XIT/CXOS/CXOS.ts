import CXOS from '@src/features/XIT/CXOS/CXOS.vue';

xit.add({
  command: ['CXOS'],
  name: 'TRADE OVERVIEW',
  description: 'Overview of recent CX trades per ticker and CX inventory with open asks.',
  component: () => CXOS,
});
