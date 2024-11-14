import CHAT from '@src/features/XIT/CHAT.vue';

xit.add({
  command: 'CHAT',
  name: 'FIO CHAT',
  description: 'Provides read-only access to a planet chat.',
  mandatoryParameters: 'Planet Identifier',
  component: () => CHAT,
});
