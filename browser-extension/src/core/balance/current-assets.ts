import { computed } from 'vue';
import { sumBy } from '@src/utils/sum-by';
import { balancesStore } from '@src/prun-api/data/balances';
import { cxosStore } from '@src/prun-api/data/cxos';
import { fxosStore } from '@src/prun-api/data/fxos';
import {
  partnerCurrentConditions,
  sumLoanInstallments,
  sumAccountsPayable,
  sumMaterialsPayable,
} from '@src/core/balance/contract-conditions';
import { getPrice } from '@src/fio/cx';
import { storagesStore } from '@src/prun-api/data/storage';
import { getStoreLocationName, sumMapValues } from '@src/core/balance/utils';

const cashTotal = computed(() => sumBy(balancesStore.all, x => x.amount));

type Currency = string;

const cxDeposits = computed(() => {
  const deposits = new Map<Currency, number>();
  const buyOrders = cxosStore.active.value.filter(x => x.type === 'BUYING');

  for (const order of buyOrders) {
    const deposit = order.limit.amount * order.amount;
    const currency = order.limit.currency;
    deposits.set(currency, (deposits.get(currency) ?? 0) + deposit);
  }

  for (const currency of balancesStore.currencies.value) {
    deposits.set(currency, deposits.get(currency) ?? 0);
  }

  return deposits;
});

const cxDepositsTotal = computed(() => sumMapValues(cxDeposits.value));

const fxDeposits = computed(() => {
  const deposits = new Map<Currency, number>();

  for (const order of fxosStore.active.value) {
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

  for (const currency of balancesStore.currencies.value) {
    deposits.set(currency, deposits.get(currency) ?? 0);
  }

  return deposits;
});

const fxDepositsTotal = computed(() => sumMapValues(fxDeposits.value));

const depositsTotal = computed(() => cxDepositsTotal.value + fxDepositsTotal.value);

const liquid = computed(() => cashTotal.value + depositsTotal.value);

const accountsReceivable = computed(() => sumAccountsPayable(partnerCurrentConditions));

const shortTermLoans = computed(() => sumLoanInstallments(partnerCurrentConditions));

const marketListedMaterials = computed(() => {
  const sellOrders = cxosStore.all.value.filter(x => x.type === 'SELLING' && x.status !== 'FILLED');
  return sumBy(sellOrders, x => getPrice(x.material.ticker) * x.amount);
});

type LocationName = string;

const inventories = computed(() => {
  const inventories = new Map<LocationName, number>();
  for (const store of storagesStore.all.value) {
    let value = 0;

    const items = store.items.map(x => x.quantity!).filter(x => !!x);
    for (const item of items) {
      value += getPrice(item.material.ticker) * item.amount;
    }

    if (value === 0) {
      continue;
    }

    const name = getStoreLocationName(store);
    inventories.set(name, (inventories.get(name) ?? 0) + value);
  }
  return inventories;
});

const inventoryTotal = computed(() => sumMapValues(inventories.value));

const materialsToReceive = computed(() => sumMaterialsPayable(partnerCurrentConditions));

const total = computed(() => {
  return (
    cashTotal.value +
    depositsTotal.value +
    marketListedMaterials.value +
    accountsReceivable.value +
    materialsToReceive.value +
    inventoryTotal.value
  );
});

const totalExceptLiquid = computed(() => total.value - liquid.value);

export const currentAssets = {
  cashTotal,
  cxDeposits,
  cxDepositsTotal,
  fxDeposits,
  fxDepositsTotal,
  depositsTotal,
  liquid,
  accountsReceivable,
  shortTermLoans,
  marketListedMaterials,
  inventories,
  inventoryTotal,
  materialsToReceive,
  total,
  totalExceptLiquid,
};
