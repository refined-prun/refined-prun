import '@src/features/XIT/ACT/actions/cx-buy/cx-buy';
import '@src/features/XIT/ACT/actions/mtra/mtra';
import '@src/features/XIT/ACT/material-groups/resupply/resupply';
import '@src/features/XIT/ACT/material-groups/repair/repair';

import Dsp from '@src/features/XIT/DSP/DSP.vue';

xit.add({
  command: ['DSP', 'DISPATCH'],
  name: 'DISPATCH',
  description: 'Plans shipments of resupply and repair materials to your bases.',
  component: () => Dsp,
  bufferSize: [800, 500],
});
