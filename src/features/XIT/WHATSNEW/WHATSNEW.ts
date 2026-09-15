import WHATSNEW from '@src/features/XIT/WHATSNEW/WHATSNEW.vue';

xit.add({
  command: 'WHATSNEW',
  name: "WHAT'S NEW",
  description: 'Refined PrUn release notes.',
  component: () => WHATSNEW,
  bufferSize: [650, 500],
});
