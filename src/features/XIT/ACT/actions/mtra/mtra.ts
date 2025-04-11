import { act } from '@src/features/XIT/ACT/act-registry';
import Edit from '@src/features/XIT/ACT/actions/mtra/Edit.vue';
import Configure from '@src/features/XIT/ACT/actions/mtra/Configure.vue';
import { TRANSFER_MATERIALS } from '@src/features/XIT/ACT/action-steps/TRANSFER_MATERIALS';
import { atSameLocation, deserializeStorage } from '@src/features/XIT/ACT/actions/mtra/utils';
import { Config } from '@src/features/XIT/ACT/actions/mtra/config';
import { configurableValue } from '@src/features/XIT/ACT/shared-types';

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
    const { data, config, log, fail, getMaterialGroup, emitStep } = ctx;

    const materials = await getMaterialGroup(data.group);
    if (!materials) {
      log.error('Invalid material group');
    }

    const serializedOrigin = data.origin === configurableValue ? config?.origin : data.origin;
    const origin = deserializeStorage(serializedOrigin);
    if (!origin) {
      log.error('Invalid origin');
    }

    const serializedDest = data.dest === configurableValue ? config?.destination : data.dest;
    const dest = deserializeStorage(serializedDest);
    if (!dest) {
      log.error('Invalid destination');
    }

    const isSameLocation = origin && dest && atSameLocation(origin, dest);
    if (!isSameLocation) {
      log.error('Origin and destination are not at the same location');
    }

    if (!materials || !origin || !dest || !isSameLocation) {
      fail();
      return;
    }

    for (const ticker of Object.keys(materials)) {
      emitStep(
        TRANSFER_MATERIALS({
          from: origin,
          to: dest,
          ticker,
          amount: materials[ticker],
        }),
      );
    }
  },
});
