import '@src/features/XIT/ACT/actions/cx-buy/cx-buy';
import '@src/features/XIT/ACT/actions/mtra/mtra';

import GovBurnExecWindow from '@src/features/XIT/GOVBURN/GovBurnExecWindow.vue';

xit.add({
  command: 'GOVBURNEXEC',
  name: 'GOVBURN EXECUTE',
  description: 'Executes the staged planetary upkeep resupply action package.',
  component: () => GovBurnExecWindow,
});
