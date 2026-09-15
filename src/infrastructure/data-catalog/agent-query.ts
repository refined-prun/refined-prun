import { dataCatalog } from '@src/infrastructure/data-catalog';
import { AgentQueryConnection } from '@src/infrastructure/data-catalog/agent-query-connection';

export const agentQueryConnection = new AgentQueryConnection(dataCatalog);
