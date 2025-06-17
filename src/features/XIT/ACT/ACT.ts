import './actions/cx-buy/cx-buy';
import './actions/mtra/mtra';
import './actions/refuel/refuel';

import './material-groups/repair/repair';
import './material-groups/resupply/resupply';
import './material-groups/manual/manual';

import ACT from '@src/features/XIT/ACT/ACT.vue';

xit.add({
  command: ['ACT', 'ACTION'],
  name: parameters => {
    if (parameters.length === 0) {
      return 'ACTION PACKAGES';
    }
    if (parameters[0].toUpperCase() == 'GEN' || parameters[0].toUpperCase() == 'EDIT') {
      return 'EDIT ACTION PACKAGE';
    }
    return 'EXECUTE ACTION PACKAGE';
  },
  description: 'Allows to automate certain tasks.',
  optionalParameters: 'GEN and/or Action Name',
  contextItems: parameters => (parameters.length > 0 ? [{ cmd: 'XIT ACT' }] : []),
  component: () => ACT,
});
