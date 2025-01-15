import { act } from '@src/features/XIT/ACT/act-registry';
import { fixed0 } from '@src/utils/format';
import Manual from '@src/features/XIT/ACT/material-groups/Manual.vue';

act.addMaterialGroup({
  type: 'Manual',
  description: group => {
    const materials = group.materials;
    if (!materials || Object.keys(materials).length == 0) {
      return '--';
    }

    return Object.keys(materials)
      .map(ticker => `${fixed0(materials[ticker])} ${ticker}`)
      .join(', ');
  },
  editForm: Manual,
});
