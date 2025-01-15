import { act } from '@src/features/XIT/ACT/act-registry';
import CXBuy from '@src/features/XIT/ACT/actions/CXBuy.vue';

act.addAction({
  type: 'CX Buy',
  description: action => {
    if (!action.group || !action.exchange) {
      return '--';
    }

    return 'Buying group ' + action.group + ' from ' + action.exchange;
  },
  editForm: CXBuy,
});
