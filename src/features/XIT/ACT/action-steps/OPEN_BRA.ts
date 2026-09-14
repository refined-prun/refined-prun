import { act } from '@src/features/XIT/ACT/act-registry';
import { getPlanetName } from '@src/core/planet-name';

interface Data {
  planet: string;
}

export const OPEN_BRA = act.addActionStep<Data>({
  type: 'OPEN_BRA',
  description: data => `Open BRA ${getPlanetName(data.planet)} for base repairs`,
  execute: async ctx => {
    const { data, waitAct, requestTile, complete } = ctx;
    const tile = await requestTile(`BRA ${data.planet}`);
    if (!tile) {
      return;
    }
    // Reminder pause: keep ACT grayed so the player runs the repair first.
    await waitAct(`Repair buildings at ${getPlanetName(data.planet)}, then continue`, {
      actDelayMs: 2000,
    });
    complete();
  },
});
