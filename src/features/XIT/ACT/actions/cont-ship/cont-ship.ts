import { act } from '@src/features/XIT/ACT/act-registry';
import Edit from '@src/features/XIT/ACT/actions/cont-ship/Edit.vue';
import Configure from '@src/features/XIT/ACT/actions/cont-ship/Configure.vue';
import { CONT_SEND } from '@src/features/XIT/ACT/action-steps/CONT_SEND';
import { Config } from '@src/features/XIT/ACT/actions/cont-ship/config';
import { AssertFn, configurableValue, groupTargetPrefix } from '@src/features/XIT/ACT/shared-types';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

function resolveLocation(
  value: string | undefined,
  config: Config | undefined,
  field: 'origin' | 'destination',
  getMaterialGroupPlanet: (name: string | undefined) => string | undefined,
): string | undefined {
  if (!value) {
    return undefined;
  }
  if (value === configurableValue) {
    return config?.[field];
  }
  if (value.startsWith(groupTargetPrefix)) {
    const groupName = value.slice(groupTargetPrefix.length);
    return getMaterialGroupPlanet(groupName);
  }
  return value;
}

function displayLocation(value: string) {
  if (value.startsWith(groupTargetPrefix)) {
    return `[${value.slice(groupTargetPrefix.length)}] target`;
  }
  return value;
}

act.addAction<Config>({
  type: 'CONT Ship',
  description: (action, config) => {
    if (!action.group || !action.contOrigin || !action.contDest) {
      return '--';
    }

    const origin =
      action.contOrigin === configurableValue
        ? (config?.origin ?? 'configured location')
        : displayLocation(action.contOrigin);
    const dest =
      action.contDest === configurableValue
        ? (config?.destination ?? 'configured location')
        : displayLocation(action.contDest);

    const payment = action.paymentPerTon ?? 0;
    const paymentStr = payment > 0 ? ` @ ${payment}/t` : '';

    return `Send contract for [${action.group}] from ${origin} to ${dest}${paymentStr}`;
  },
  editComponent: Edit,
  configureComponent: Configure,
  needsConfigure: data => {
    return data.contOrigin === configurableValue || data.contDest === configurableValue;
  },
  isValidConfig: (data, config) => {
    return (
      (data.contOrigin !== configurableValue || config.origin !== undefined) &&
      (data.contDest !== configurableValue || config.destination !== undefined)
    );
  },
  generateSteps: async ctx => {
    const { data, config, packageName, getMaterialGroup, getMaterialGroupPlanet, emitStep } = ctx;
    const assert: AssertFn = ctx.assert;

    const materials = await getMaterialGroup(data.group);
    assert(materials, 'Invalid material group');

    const contOrigin = resolveLocation(data.contOrigin, config, 'origin', getMaterialGroupPlanet);
    assert(contOrigin, 'Invalid origin');

    const contDest = resolveLocation(data.contDest, config, 'destination', getMaterialGroupPlanet);
    assert(contDest, 'Invalid destination');

    const paymentPerTon = Number(data.paymentPerTon ?? 0);
    const daysToFulfill = data.daysToFulfill ?? 3;
    const currency = data.currency ?? 'NCC';

    let totalTonnage = 0;
    for (const [ticker, amount] of Object.entries(materials)) {
      const material = materialsStore.getByTicker(ticker);
      totalTonnage += material ? material.weight * amount : amount;
    }
    const totalPayment = Math.round(totalTonnage * paymentPerTon);

    emitStep(
      CONT_SEND({
        packageName,
        materials,
        contractNote: data.contractNote,
        payment: totalPayment,
        currency,
        daysToFulfill,
        contOrigin,
        contDest,
      }),
    );
  },
});
