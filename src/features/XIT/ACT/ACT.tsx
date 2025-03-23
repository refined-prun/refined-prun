import './ACT.css';

import './actions/cx-buy';
import './actions/mtra';

import './material-groups/repair';
import './material-groups/resupply';
import './material-groups/manual';

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
