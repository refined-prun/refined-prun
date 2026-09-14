import Agent from './Agent.vue';
import ExecuteStoredPackage from './ExecuteStoredPackage.vue';

xit.add({
  command: 'AGENT',
  name: 'Agent',
  description: 'Lists action packages synced via the private refined-agent channel.',
  optionalParameters: 'Message ID',
  component: params => (params.length > 0 ? ExecuteStoredPackage : Agent),
});
