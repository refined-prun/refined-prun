import INV from './INV.vue';

xit.add({
  command: 'INV',
  name: 'INVENTORIES',
  description: 'Lists all inventories with cargo bars and filters by type.',
  component: () => INV,
  bufferSize: [620, 400],
});
