import '@src/features/XIT/ACT/actions/ship-contracts/ship-contracts';

import ShipContractsActWindow from '@src/features/XIT/ACT/actions/ship-contracts/ShipContractsActWindow.vue';

xit.add({
  command: 'SHPTACT',
  name: 'LOAD SHIPPING CONTRACTS',
  description: 'Accepts and picks up shipping ads for a ship, then opens SFC.',
  mandatoryParameters: 'Ship, Destination, Ads',
  component: () => ShipContractsActWindow,
});
