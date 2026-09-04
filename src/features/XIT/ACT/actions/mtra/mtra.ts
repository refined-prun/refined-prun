import { act } from '@src/features/XIT/ACT/act-registry';
import Edit from '@src/features/XIT/ACT/actions/mtra/Edit.vue';
import Configure from '@src/features/XIT/ACT/actions/mtra/Configure.vue';
import { MTRA_TRANSFER } from '@src/features/XIT/ACT/action-steps/MTRA_TRANSFER';
import { atSameLocation, deserializeStorage } from '@src/features/XIT/ACT/actions/utils';
import { Config } from '@src/features/XIT/ACT/actions/mtra/config';
import {
  AssertFn,
  actionTargetPrefix,
  configurableValue,
} from '@src/features/XIT/ACT/shared-types';
import { resolveActionDest } from '@src/features/XIT/ACT/reference-utils';

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
    let dest: string;
    if (action.dest?.startsWith(actionTargetPrefix)) {
      dest = `Same as: ${action.dest.slice(actionTargetPrefix.length)} dest`;
    } else if (action.dest == configurableValue) {
      dest = config?.destination ?? 'configured location';
    } else {
      dest = action.dest!;
    }
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
    const { data, config, pkg, fullConfig, getMaterialGroup, emitStep } = ctx;
    const assert: AssertFn = ctx.assert;

    const materials = await getMaterialGroup(data.group);
    assert(materials, 'Invalid material group');

    const serializedOrigin = data.origin === configurableValue ? config?.origin : data.origin;
    const origin = deserializeStorage(serializedOrigin);
    assert(origin, 'Invalid origin');

    let serializedDest: string | undefined;
    if (data.dest?.startsWith(actionTargetPrefix)) {
      serializedDest = resolveActionDest(data.dest, pkg, fullConfig);
      assert(serializedDest, `Failed to resolve destination reference: ${data.dest}`);
    } else {
      serializedDest = data.dest === configurableValue ? config?.destination : data.dest;
    }
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
