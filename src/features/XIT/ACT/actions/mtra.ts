import { act } from '@src/features/XIT/ACT/act-registry';
import MTRA from '@src/features/XIT/ACT/actions/MTRA.vue';

act.addAction({
  type: 'MTRA',
  description: action => {
    if (!action.group || !action.origin || !action.dest) {
      return '--';
    }

    const origin =
      action.origin == 'Configure on Execution' ? 'configured location' : action.origin;
    const dest = action.dest == 'Configure on Execution' ? 'configured location' : action.dest;

    return `Transfer group ${action.group} from ${origin} to ${dest}`;
  },
  editForm: MTRA,
});
