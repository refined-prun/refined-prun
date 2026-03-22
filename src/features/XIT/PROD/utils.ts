import { castArray } from '@src/utils/cast-array';
import { PlatformProduction } from '@src/core/production';

interface ProductionFilters {
  production: boolean;
  inactive: boolean;
  queue: boolean;
  notQueued: boolean;
}

export function matchesProductionFilter(
  lines: Arrayable<PlatformProduction>,
  filters: ProductionFilters,
): boolean {
  let activeCapacity = 0;
  let inactiveCapacity = 0;
  let queuedOrders = 0;

  for (const line of castArray(lines)) {
    activeCapacity += line.activeCapacity;
    inactiveCapacity += line.inactiveCapacity;
    queuedOrders += line.queuedOrders.length;
  }

  if (activeCapacity > 0 && filters.production) {
    return true;
  }
  if (inactiveCapacity > 0 && filters.inactive) {
    return true;
  }
  if (queuedOrders > 0 && filters.queue) {
    return true;
  }
  if (queuedOrders === 0 && filters.notQueued) {
    return true;
  }

  return false;
}
