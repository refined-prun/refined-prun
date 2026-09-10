import { getAddressName } from '@src/infrastructure/prun-api/data/addresses';

export function compareConditions(a: PrunApi.ContractCondition, b: PrunApi.ContractCondition) {
  if (a.deadline && b.deadline) {
    return a.deadline.timestamp - b.deadline.timestamp;
  }
  if (!a.deadline && b.deadline) {
    return 1;
  }
  if (!b.deadline && a.deadline) {
    return -1;
  }

  let result = compare(a.type, b.type);
  if (result !== 0) {
    return result;
  }

  if (a.address && b.address) {
    result = compare(getCachedAddressName(a.address), getCachedAddressName(b.address));
    if (result !== 0) {
      return result;
    }
  }

  if (a.destination && b.destination) {
    result = compare(getCachedAddressName(a.destination), getCachedAddressName(b.destination));
    if (result !== 0) {
      return result;
    }
  }

  if (a.quantity && b.quantity) {
    result = compare(a.quantity.material.ticker, b.quantity.material.ticker);
    if (result !== 0) {
      return result;
    }

    let amountA = a.quantity.amount;
    let amountB = b.quantity.amount;
    if (a.type === 'COMEX_PURCHASE_PICKUP') {
      amountA -= a.pickedUp?.amount ?? 0;
      amountB -= b.pickedUp?.amount ?? 0;
    }

    result = amountA - amountB;
    if (result !== 0) {
      return result;
    }
  }

  return 0;
}

function compare(a: string, b: string) {
  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  return 0;
}

const cachedNames = new WeakMap<PrunApi.Address, string>();

function getCachedAddressName(address: PrunApi.Address) {
  let name = cachedNames.get(address);
  if (name) {
    return name;
  }

  name = getAddressName(address);
  if (name) {
    cachedNames.set(address, name);
  }

  return name ?? '';
}
