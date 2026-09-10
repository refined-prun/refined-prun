import { addressesStore, isSameAddress } from '@src/infrastructure/prun-api/data/addresses';
import { balancesStore } from '@src/infrastructure/prun-api/data/balances';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';

export function isFulfillable(
  contract?: PrunApi.Contract | null,
  condition?: PrunApi.ContractCondition | null,
) {
  if (!condition || !contract) {
    return false;
  }
  if (condition.party !== contract.party) {
    return false;
  }
  if (contract.status !== 'CLOSED' && contract.status !== 'PARTIALLY_FULFILLED') {
    return false;
  }
  if (
    condition.status !== 'PENDING' &&
    condition.status !== 'PARTLY_FULFILLED' &&
    condition.status !== 'FULFILLMENT_ATTEMPTED'
  ) {
    return false;
  }
  if (
    condition.dependencies?.some(
      id => contract.conditions.find(x => x.id === id)?.status !== 'FULFILLED',
    )
  ) {
    return false;
  }

  switch (condition.type) {
    case 'PAYMENT':
    case 'WORKFORCE_PROGRAM_PAYMENT':
    case 'LOAN_PAYOUT':
      return hasFunds(condition.amount);
    case 'LOAN_INSTALLMENT':
      return hasFunds(condition.total);
    case 'PROVISION':
      return hasProvision(condition.address, condition.quantity);
    case 'PROVISION_SHIPMENT':
      return !condition.quantity || hasProvision(condition.address, condition.quantity);
    case 'DELIVERY': {
      const quantity = condition.quantity;
      if (!quantity) {
        return false;
      }
      const available = getStoresAtAddress(condition.address).flatMap(x =>
        x.items
          .filter(x => x.type === 'INVENTORY' && x.quantity?.material.id === quantity.material.id)
          .map(x => x.quantity!.amount),
      );
      return Math.max(0, ...available) >= quantity.amount;
    }
    case 'COMEX_PURCHASE_PICKUP':
      return (
        !!condition.quantity &&
        !!condition.pickedUp &&
        condition.quantity.amount - condition.pickedUp.amount > 0 &&
        getStoresAtAddress(condition.address).some(x => x.tradeStore)
      );
    case 'PICKUP_SHIPMENT':
      return (
        condition.weight === undefined ||
        condition.weight === 0 ||
        getStoresAtAddress(condition.address).some(
          x =>
            (x.type === 'STORE' || x.type === 'SHIP_STORE' || x.type === 'WAREHOUSE_STORE') &&
            x.weightLoad + condition.weight! <= x.weightCapacity &&
            x.volumeLoad + condition.volume! <= x.volumeCapacity,
        )
      );
    case 'DELIVERY_SHIPMENT':
      return (
        !!condition.shipmentItemId &&
        getStoresAtAddress(condition.destination).some(x =>
          x.items.some(x => x.id === condition.shipmentItemId),
        )
      );
    case 'EXPLORATION':
      return (
        shipsStore.all.value?.some(x => isSameAddress(addressesStore[x.id], condition.address)) ??
        false
      );
    case 'WORKFORCE_PROGRAM_START':
    case 'INFRASTRUCTURE_CONSTRUCTION_START':
    case 'INFRASTRUCTURE_UPGRADE_START':
      return true;
    default:
      return false;
  }
}

function hasFunds(amount?: PrunApi.CurrencyAmount) {
  return !!amount && amount.amount <= (balancesStore.getById(amount.currency)?.amount ?? 0);
}

function getStoresAtAddress(address?: PrunApi.Address) {
  return Object.entries(addressesStore)
    .filter(([, value]) => isSameAddress(address, value))
    .flatMap(([id]) => storagesStore.getByAddressableId(id) ?? []);
}

function hasProvision(address?: PrunApi.Address, quantity?: PrunApi.MaterialAmount | null) {
  if (!quantity) {
    return false;
  }
  return getStoresAtAddress(address).some(x => {
    if (!x.fixed) {
      return false;
    }
    const item = x.items.find(
      x => x.type === 'INVENTORY' && x.quantity?.material.id === quantity.material.id,
    );
    return quantity.amount <= (item?.quantity?.amount ?? 0);
  });
}
