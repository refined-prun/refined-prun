import STOCK from '@src/features/XIT/STOCK/STOCK.vue';

xit.add({
  command: 'STOCK',
  name: parameters => {
    if (parameters.length === 0) {
      return 'STOCK PRESETS';
    }
    if (parameters[0].toUpperCase() === 'EDIT') {
      return 'EDIT STOCK PRESET';
    }
    return `STOCK - ${parameters.join(' ').split('_').join(' ')}`;
  },
  description: 'Tracks configured materials against per-planet target amounts.',
  optionalParameters: 'EDIT and/or Preset Name',
  contextItems: parameters => (parameters.length > 0 ? [{ cmd: 'XIT STOCK' }] : []),
  component: () => STOCK,
});
