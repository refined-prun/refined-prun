import { act } from '@src/features/XIT/ACT/act-registry';
import Edit from '@src/features/XIT/ACT/actions/cont-trade/Edit.vue';
import Configure from '@src/features/XIT/ACT/actions/cont-trade/Configure.vue';
import { CONT_TRADE } from '@src/features/XIT/ACT/action-steps/CONT_TRADE';
import { Config } from '@src/features/XIT/ACT/actions/cont-trade/config';
import { AssertFn, configurableValue } from '@src/features/XIT/ACT/shared-types';
import {
  displayLocationValue,
  resolveLocation,
} from '@src/features/XIT/ACT/actions/cont-locations';

act.addAction<Config>({
  type: 'CONT Trade',
  shortDescription: 'Create a buying or selling contract draft',
  description: (action, config) => {
    if (!action.group || !action.contLocation) {
      return '--';
    }

    const tradeLabel = action.contTradeType === 'SELLING' ? 'Sell' : 'Buy';
    const location =
      action.contLocation === configurableValue
        ? (config?.location ?? 'configured location')
        : displayLocationValue(action.contLocation);

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
    const { data, config, packageName, getMaterialGroup, getMaterialGroupPlanet, emitStep } = ctx;
    const assert: AssertFn = ctx.assert;

    const materials = await getMaterialGroup(data.group);
    assert(materials, 'Invalid material group');

    const includedMaterials = Object.values(materials).filter(x => x.quantity > 0);
    assert(includedMaterials.length > 0, 'Material group has no materials to trade');
    assert(
      includedMaterials.every(
        x =>
          x.price !== undefined &&
          Number.isFinite(x.price) &&
          x.price >= 0.01 &&
          x.price <= 100000000,
      ),
      `Each included material in [${data.group}] must have a price from 0.01 to 100000000. Use a Paste group with 3 columns (ticker, amount, price).`,
    );

    assert(data.contLocation, 'Missing location');
    const location = resolveLocation(data.contLocation, config?.location, getMaterialGroupPlanet);
    assert(location, 'Invalid location');

    const tradeType = data.contTradeType ?? 'BUYING';
    const daysToFulfill = data.daysToFulfill ?? 3;
    const currency = data.currency ?? 'AIC';

    emitStep(
      CONT_TRADE({
        packageName,
        materials,
        tradeType,
        location,
        currency,
        daysToFulfill,
      }),
    );
  },
});
