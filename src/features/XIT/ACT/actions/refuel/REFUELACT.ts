import '@src/features/XIT/ACT/actions/refuel/refuel';

import RefuelActWindow from '@src/features/XIT/ACT/actions/refuel/RefuelActWindow.vue';

xit.add({
  command: 'REFUELACT',
  name: 'REFUEL ALL EXCHANGES',
  description: 'Executes a refuel action package for all ships docked at exchanges.',
  component: () => RefuelActWindow,
});
