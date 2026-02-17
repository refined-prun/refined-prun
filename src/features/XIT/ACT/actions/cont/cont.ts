import { act } from '@src/features/XIT/ACT/act-registry';
import Edit from '@src/features/XIT/ACT/actions/cont/Edit.vue';
import { CONT_SEND } from '@src/features/XIT/ACT/action-steps/CONT_SEND';
import { AssertFn } from '@src/features/XIT/ACT/shared-types';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

act.addAction({
  type: 'CONT',
  description: action => {
    if (!action.group || !action.contOrigin || !action.contDest) {
      return '--';
    }

    const payment = action.paymentPerTon ?? 0;
    const paymentStr = payment > 0 ? ` @ ${payment}/t` : '';

    return `Send contract for [${action.group}] from ${action.contOrigin} to ${action.contDest}${paymentStr}`;
  },
  editComponent: Edit,
  generateSteps: async ctx => {
    const { data, packageName, getMaterialGroup, emitStep } = ctx;
    const assert: AssertFn = ctx.assert;

    const materials = await getMaterialGroup(data.group);
    assert(materials, 'Invalid material group');

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
        contOrigin: data.contOrigin,
        contDest: data.contDest,
      }),
    );
  },
});
