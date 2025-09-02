import { act } from '@src/features/XIT/ACT/act-registry';
import Edit from '@src/features/XIT/ACT/actions/mtra/Edit.vue';
import Configure from '@src/features/XIT/ACT/actions/mtra/Configure.vue';
import { MTRA_TRANSFER } from '@src/features/XIT/ACT/action-steps/MTRA_TRANSFER.ts';
import { atSameLocation, deserializeStorage } from '@src/features/XIT/ACT/actions/utils';
import { Config } from '@src/features/XIT/ACT/actions/mtra/config';
import { AssertFn, configurableValue } from '@src/features/XIT/ACT/shared-types';

act.addAction<Config>({
  type: 'MTRA',
  description: (action, config) => {
    if (!action.group || !action.origin || !action.dest) {
      return '--';
    }

    const origin =
      action.origin == configurableValue
        ? (config?.origin ?? 'configured location')
        : action.origin;
    const dest =
      action.dest == configurableValue
        ? (config?.destination ?? 'configured location')
        : action.dest;
    return `Transfer group [${action.group}] from ${origin} to ${dest}`;
  },
  editComponent: Edit,
  configureComponent: Configure,
  needsConfigure: data => {
    return data.origin === configurableValue || data.dest === configurableValue;
  },
  isValidConfig: (data, config) => {
    return (
      (data.origin !== configurableValue || config.origin !== undefined) &&
      (data.dest !== configurableValue || config.destination !== undefined)
    );
  },
  generateSteps: async ctx => {
    const { data, config, getMaterialGroup, emitStep } = ctx;
    const assert: AssertFn = ctx.assert;

    const materials = await getMaterialGroup(data.group);
    assert(materials, 'Invalid material group');

    const serializedOrigin = data.origin === configurableValue ? config?.origin : data.origin;
    const origin = deserializeStorage(serializedOrigin);
    assert(origin, 'Invalid origin');

    const serializedDest = data.dest === configurableValue ? config?.destination : data.dest;
    const dest = deserializeStorage(serializedDest);
    assert(dest, 'Invalid destination');

    const isSameLocation = atSameLocation(origin, dest);
    assert(isSameLocation, 'Origin and destination are not at the same location');

    for (const ticker of Object.keys(materials)) {
      emitStep(
        MTRA_TRANSFER({
          from: origin.id,
          to: dest.id,
          ticker,
          amount: materials[ticker],
        }),
      );
    }
  },
});
