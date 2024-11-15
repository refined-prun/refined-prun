import TODO from './TODO.vue';

xit.add({
  command: ['TODO'],
  name: 'TO-DO LIST',
  description: 'Provides a to-do list for organizing your plans.',
  optionalParameters: 'To-do List Identifier or Name',
  component: () => TODO,
});
