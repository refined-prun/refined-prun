import { act } from '@src/features/XIT/ACT/act-registry';
import Resupply from '@src/features/XIT/ACT/material-groups/Resupply.vue';

act.addMaterialGroup({
  type: 'Resupply',
  description: group => {
    if (!group.planet || !group.days) {
      return '--';
    }

    return `Resupply ${group.planet} with ${group.days} day${group.days == 1 ? '' : 's'} of supplies`;
  },
  editForm: Resupply,
});
