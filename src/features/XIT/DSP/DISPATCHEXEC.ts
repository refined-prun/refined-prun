import '@src/features/XIT/ACT/actions/cx-buy/cx-buy';
import '@src/features/XIT/ACT/actions/mtra/mtra';
import '@src/features/XIT/ACT/actions/refuel/refuel';
import '@src/features/XIT/ACT/material-groups/resupply/resupply';
import '@src/features/XIT/ACT/material-groups/repair/repair';

import DispatchExecWindow from '@src/features/XIT/DSP/DispatchExecWindow.vue';

xit.add({
  command: ['DISPATCHEXEC', 'DISPATCHACT'],
  hidden: true,
  name: 'DISPATCH EXECUTE',
  description: 'Executes the staged dispatch resupply/repair action package.',
  component: () => DispatchExecWindow,
});
