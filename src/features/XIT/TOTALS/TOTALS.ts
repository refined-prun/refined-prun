import TOTALS from '@src/features/XIT/TOTALS/TOTALS.vue';

xit.add({
  command: 'TOTALS',
  name: parameters => {
    if (parameters.length === 0) {
      return 'ITEM TOTALS';
    }
    if (parameters[0].toUpperCase() === 'EDIT') {
      return 'EDIT TOTALS PRESET';
    }
    return `TOTALS - ${parameters.join(' ').split('_').join(' ')}`;
  },
  description: 'Shows the total amount of each item across all your inventories.',
  optionalParameters: 'EDIT and/or Preset Name',
  contextItems: parameters => (parameters.length > 0 ? [{ cmd: 'XIT TOTALS' }] : []),
  component: () => TOTALS,
});
