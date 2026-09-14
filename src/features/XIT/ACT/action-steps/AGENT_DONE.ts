import { act } from '@src/features/XIT/ACT/act-registry';
import { postAgentMessage } from '@src/infrastructure/prun-ui/agent-channel-messaging';

interface Data {
  id: string;
}

export const AGENT_DONE = act.addActionStep<Data>({
  type: 'AGENT_DONE',
  description: data => `Post completion marker [${data.id}] to the agent channel`,
  execute: async ctx => {
    const { data, waitAct, complete, fail } = ctx;
    await waitAct();
    try {
      await postAgentMessage(data.id);
    } catch (e) {
      fail(e instanceof Error ? e.message : String(e));
      return;
    }
    complete();
  },
});
