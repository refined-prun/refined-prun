import ELEC from '@src/features/XIT/ELEC/ELEC.vue';

xit.add({
  command: 'ELEC',
  name: 'ELECTIONS',
  description: 'Upcoming elections for planets you have bases on.',
  component: () => ELEC,
});
