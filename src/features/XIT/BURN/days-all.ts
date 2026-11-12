import type { MaterialBurn } from '@src/core/burn';

// Days left when the warehouse stock on the same planet is added to the base stock.
export function getDaysAll(mat: MaterialBurn) {
  if (mat.dailyAmount >= 0) {
    return Number.POSITIVE_INFINITY;
  }
  const total =
    mat.inventory + mat.inboundInventory + mat.remainingAllocation + (mat.warehouseInventory ?? 0);
  return total / -mat.dailyAmount;
}
