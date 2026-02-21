import { act } from '@src/features/XIT/ACT/act-registry';
import Edit from '@src/features/XIT/ACT/actions/cont-trade/Edit.vue';
import Configure from '@src/features/XIT/ACT/actions/cont-trade/Configure.vue';
import { CONT_TRADE } from '@src/features/XIT/ACT/action-steps/CONT_TRADE';
import { Config } from '@src/features/XIT/ACT/actions/cont-trade/config';
import { AssertFn, configurableValue, groupTargetPrefix } from '@src/features/XIT/ACT/shared-types';

function resolveLocation(
  value: string | undefined,
  config: Config | undefined,
  getMaterialGroupPlanet: (name: string | undefined) => string | undefined,
): string | undefined {
  if (!value) {
    return undefined;
  }
  if (value === configurableValue) {
    return config?.location;
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
  type: 'CONT Trade',
  description: (action, config) => {
    if (!action.group || !action.contLocation) {
      return '--';
    }

    const tradeLabel = action.contTradeType === 'SELLING' ? 'Sell' : 'Buy';
    const location =
      action.contLocation === configurableValue
        ? (config?.location ?? 'configured location')
        : displayLocation(action.contLocation);

    return `${tradeLabel} contract for [${action.group}] at ${location}`;
  },
  editComponent: Edit,
  configureComponent: Configure,
  needsConfigure: data => {
    return data.contLocation === configurableValue;
  },
  isValidConfig: (data, config) => {
    return data.contLocation !== configurableValue || config.location !== undefined;
  },
  generateSteps: async ctx => {
    const {
      data,
      config,
      packageName,
      getMaterialGroup,
      getMaterialGroupPrices,
      getMaterialGroupPlanet,
      emitStep,
    } = ctx;
    const assert: AssertFn = ctx.assert;

    const materials = await getMaterialGroup(data.group);
    assert(materials, 'Invalid material group');

    const prices = getMaterialGroupPrices(data.group);
    assert(
      prices,
      `Material group [${data.group}] has no prices. Use a Paste group with 3 columns (ticker, amount, price).`,
    );

    const location = resolveLocation(data.contLocation, config, getMaterialGroupPlanet);
    assert(location, 'Invalid location');

    const tradeType = data.contTradeType ?? 'BUYING';
    const daysToFulfill = data.daysToFulfill ?? 3;
    const currency = data.currency ?? 'NCC';

    emitStep(
      CONT_TRADE({
        packageName,
        materials,
        prices,
        tradeType,
        location,
        currency,
        daysToFulfill,
      }),
    );
  },
});
