import PX from './PX.vue';

xit.add({
  command: ['PX', 'PXB'],
  name: 'PrUnderground Listings',
  description: 'Lets you browse Prunderground listings.',
  mandatoryParameters: 'None',
  component: () => PX,
});
xit.add({
  command: ['PXOS', 'PXBB'],
  name: 'PrUnderground Bundle Listings',
  description: 'Lets you browse Prunderground bundle listings.',
  mandatoryParameters: 'None',
  component: () => PX,
});
xit.add({
  command: ['PXD'],
  name: 'PrUnderground Dashboard',
  description: 'Lets you view your Prunderground dashboard.',
  mandatoryParameters: 'None',
  component: () => PX,
});
xit.add({
  command: ['PXA'],
  name: 'PrUnderground Account',
  description: 'Lets you manage your Prunderground account.',
  mandatoryParameters: 'None',
  component: () => PX,
});
