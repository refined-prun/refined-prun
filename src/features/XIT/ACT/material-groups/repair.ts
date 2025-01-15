import { act } from '@src/features/XIT/ACT/act-registry';
import Repair from '@src/features/XIT/ACT/material-groups/Repair.vue';

act.addMaterialGroup({
  type: 'Repair',
  description: group => {
    if (!group.planet) {
      return '--';
    }

    const days = group.days;
    const daysPart = days ? `older than ${days} day${days == 1 ? '' : 's'}` : '';
    const advanceDays = group.advanceDays || 0;
    return `Repair buildings on ${group.planet} ${daysPart} in ${advanceDays} day${advanceDays == 1 ? '' : 's'}`;
  },
  editForm: Repair,
});
