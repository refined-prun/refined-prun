import SHPT from '@src/features/XIT/SHPT/SHPT.vue';

xit.add({
  command: 'SHPT',
  name: 'SHIPMENTS',
  description: 'Shows pending shipment items grouped by destination.',
  component: () => SHPT,
});
