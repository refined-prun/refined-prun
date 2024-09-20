import { computed } from 'vue';
import { sumBy } from '@src/utils/sum-by';
import { balancesStore } from '@src/infrastructure/prun-api/data/balances';
import { cxosStore } from '@src/infrastructure/prun-api/data/cxos';
import { fxosStore } from '@src/infrastructure/prun-api/data/fxos';
import {
  selfConditions,
  partnerCurrentConditions,
  sumLoanRepayments,
  sumAccountsPayable,
  sumDeliveries,
  sumPendingMaterialsPickup,
  sumMaterialsShipment,
  sumMaterialsPickup,
  sumLoanInterest,
} from '@src/core/balance/contract-conditions';
import { getPrice } from '@src/infrastructure/fio/cx';
import { sumMapValues } from '@src/core/balance/utils';
import { inventory } from '@src/core/balance/inventory';
import { currentOrderValue, totalOrderValue } from './orders';
import { sum } from '@src/utils/sum';

const cashTotal = computed(() => sumBy(balancesStore.all.value, x => x.amount));

type Currency = string;

const cxDeposits = computed(() => {
  const orders = cxosStore.active.value;
  if (orders === undefined) {
    return undefined;
  }
  const deposits = new Map<Currency, number>();
  const buyOrders = orders.filter(x => x.type === 'BUYING');

  for (const order of buyOrders) {
    const deposit = order.limit.amount * order.amount;
    const currency = order.limit.currency;
    deposits.set(currency, (deposits.get(currency) ?? 0) + deposit);
  }

  return deposits;
});

const cxDepositsTotal = computed(() => sumMapValues(cxDeposits.value));

const fxDeposits = computed(() => {
  const orders = fxosStore.active.value;
  if (orders === undefined) {
    return undefined;
  }
  const deposits = new Map<Currency, number>();

  for (const order of orders) {
    let deposit: number;
    let currency: string;
    if (order.type === 'SELLING') {
      deposit = order.amount.amount;
      currency = order.limit.base;
    } else {
      deposit = order.amount.amount * order.limit.rate;
      currency = order.limit.quote;
    }
    deposits.set(currency, (deposits.get(currency) ?? 0) + deposit);
  }

  return deposits;
});

const fxDepositsTotal = computed(() => sumMapValues(fxDeposits.value));

const depositsTotal = computed(() => sum(cxDepositsTotal.value, fxDepositsTotal.value));

const interestReceivable = computed(() => sumLoanInterest(partnerCurrentConditions));

const accountsReceivable = computed(() => sumAccountsPayable(partnerCurrentConditions));

const shortTermLoans = computed(() => sumLoanRepayments(partnerCurrentConditions));

const marketListedMaterials = computed(() => {
  const sellOrders = cxosStore.all.value?.filter(
    x => x.type === 'SELLING' && x.status !== 'FILLED',
  );
  return sumBy(sellOrders, x => {
    const price = getPrice(x.material.ticker);
    if (price === undefined) {
      return undefined;
    }
    return price * x.amount;
  });
});

const materialsToReceive = computed(() =>
  sum(
    sumDeliveries(partnerCurrentConditions),
    sumMaterialsShipment(partnerCurrentConditions),
    sumMaterialsPickup(selfConditions),
    // After all dependencies are fulfilled,
    // the player must pick up the materials via COMEX_PURCHASE_PICKUP condition.
    // We'll consider these materials as a part of current assets, regardless of
    // COMEX_PURCHASE_PICKUP deadline, since they can be picked up at any time.
    sumPendingMaterialsPickup(selfConditions),
  ),
);

export const currentAssets = {
  cashTotal,
  cxDeposits,
  fxDeposits,
  depositsTotal,
  interestReceivable,
  accountsReceivable,
  shortTermLoans,
  orders: currentOrderValue,
  totalOrderValue,
  marketListedMaterials,
  inventory: inventory.total,
  materialsToReceive,
};
