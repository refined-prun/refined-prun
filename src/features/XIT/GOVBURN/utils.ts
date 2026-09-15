import { clamp } from '@src/utils/clamp';

const MS_IN_DAY = 24 * 60 * 60 * 1000;

// Days from `now` until the first consumption tick this material cannot pay.
export function materialDays(upkeep: UserData.GovBurnUpkeep, now: number) {
  const ticksPaid = upkeep.amount > 0 ? Math.floor(upkeep.stored / upkeep.amount) : 0;
  const days = (upkeep.nextTick - now) / MS_IN_DAY + ticksPaid * upkeep.duration;
  return Math.max(0, days);
}

// Days until the first unpaid tick, using the same slots as GOVBURNACT.
// Unresolved slots use the earliest tick among unpicked materials.
// Contribution history reflects captured payloads, not live state.
// Unconfigured (n <= -1) or missing upkeep data returns 0; deliberately
// unsupplied (n === 0) returns infinity, even without upkeep data.
export function buildingDays(
  building: UserData.GovBurnBuilding,
  n: number,
  now: number,
  saved?: string[],
) {
  if (n <= -1) {
    return 0;
  }
  if (n === 0) {
    return Number.POSITIVE_INFINITY;
  }
  const upkeeps = building.upkeeps;
  if (!upkeeps || upkeeps.length === 0) {
    return 0;
  }
  const slots = resolveSlots(building, n, saved);
  let days = Number.POSITIVE_INFINITY;
  let hasUnresolved = false;
  const picked = new Set<string>();
  for (const slot of slots) {
    if (slot.ticker === '') {
      hasUnresolved = true;
      continue;
    }
    picked.add(slot.ticker);
    const upkeep = upkeeps.find(x => x.ticker === slot.ticker);
    if (!upkeep) {
      continue;
    }
    days = Math.min(days, materialDays(upkeep, now));
  }
  if (hasUnresolved) {
    for (const upkeep of upkeeps) {
      if (picked.has(upkeep.ticker)) {
        continue;
      }
      days = Math.min(days, Math.max(0, (upkeep.nextTick - now) / MS_IN_DAY));
    }
  }
  return days;
}

// Earliest unpaid tick across built infrastructure; missing settings mean unconfigured.
// Data availability means at least one built project has captured upkeeps.
export function planetDays(
  planet: UserData.GovBurnPlanet,
  planetConfig: UserData.GovBurnPlanetConfig,
  now: number,
  savedSlots?: UserData.GovBurnPlanetSlots,
) {
  let days = Number.POSITIVE_INFINITY;
  let hasData = false;
  for (const building of planet.buildings) {
    if (building.level <= 0) {
      continue;
    }
    if (building.upkeeps !== undefined) {
      hasData = true;
    }
    const n = planetConfig[building.ticker] ?? -1;
    days = Math.min(days, buildingDays(building, n, now, savedSlots?.[building.ticker]));
  }
  return { days, hasData };
}

export interface SlotPick {
  ticker: string;
  // Manual covers both saved selections and unresolved slots.
  source: 'reserve' | 'own-history' | 'any-history' | 'manual';
}

// Prefer reserves (whole ticks, then stored/amount), then recent own contributions,
// then recent contributions from anyone. Ties retain upkeep order.
// Clamp n to the upkeep count; slots without a signal require manual selection.
export function rankSlots(building: UserData.GovBurnBuilding, n: number) {
  const upkeeps = building.upkeeps ?? [];
  const slotCount = clamp(n, 0, upkeeps.length);
  if (slotCount === 0) {
    return [];
  }

  const history = building.contribHistory ?? {};
  const picked = new Set<string>();
  const result: SlotPick[] = [];

  const reserve = upkeeps
    .map((x, index) => ({
      ticker: x.ticker,
      ticks: x.amount > 0 ? Math.floor(x.stored / x.amount) : 0,
      ratio: x.amount > 0 ? x.stored / x.amount : 0,
      index,
      stored: x.stored,
    }))
    .filter(x => x.stored > 0)
    .sort((a, b) => {
      const byTicks = b.ticks - a.ticks;
      if (byTicks !== 0) {
        return byTicks;
      }
      const byRatio = b.ratio - a.ratio;
      if (byRatio !== 0) {
        return byRatio;
      }
      return a.index - b.index;
    });
  for (const item of reserve) {
    if (result.length >= slotCount) {
      break;
    }
    picked.add(item.ticker);
    result.push({ ticker: item.ticker, source: 'reserve' });
  }

  if (result.length < slotCount) {
    const own = upkeeps
      .map((x, index) => ({
        ticker: x.ticker,
        own: history[x.ticker]?.own,
        index,
      }))
      .filter(x => !picked.has(x.ticker) && x.own !== undefined)
      .sort((a, b) => {
        const byOwn = b.own! - a.own!;
        if (byOwn !== 0) {
          return byOwn;
        }
        return a.index - b.index;
      });
    for (const item of own) {
      if (result.length >= slotCount) {
        break;
      }
      picked.add(item.ticker);
      result.push({ ticker: item.ticker, source: 'own-history' });
    }
  }

  if (result.length < slotCount) {
    const any = upkeeps
      .map((x, index) => ({
        ticker: x.ticker,
        any: history[x.ticker]?.any,
        index,
      }))
      .filter(x => !picked.has(x.ticker) && x.any !== undefined)
      .sort((a, b) => {
        const byAny = b.any! - a.any!;
        if (byAny !== 0) {
          return byAny;
        }
        return a.index - b.index;
      });
    for (const item of any) {
      if (result.length >= slotCount) {
        break;
      }
      picked.add(item.ticker);
      result.push({ ticker: item.ticker, source: 'any-history' });
    }
  }

  while (result.length < slotCount) {
    result.push({ ticker: '', source: 'manual' });
  }
  return result;
}

// Keep valid, unique saved picks at their indices, including explicitly cleared slots.
// Fill remaining slots by rank; clamp the total to the upkeep count.
export function resolveSlots(
  building: UserData.GovBurnBuilding,
  n: number,
  saved: string[] | undefined,
) {
  const upkeeps = building.upkeeps ?? [];
  const slotCount = clamp(n, 0, upkeeps.length);
  if (slotCount === 0) {
    return [];
  }

  const valid = new Set(upkeeps.map(x => x.ticker));
  const used = new Set<string>();
  const result: SlotPick[] = Array.from({ length: slotCount }, () => ({
    ticker: '',
    source: 'manual' as const,
  }));

  for (let i = 0; i < slotCount; i++) {
    const ticker = saved?.[i];
    if (ticker === undefined || ticker === '' || !valid.has(ticker) || used.has(ticker)) {
      continue;
    }
    used.add(ticker);
    result[i] = { ticker, source: 'manual' };
  }

  const ranked = rankSlots(building, slotCount);
  let rankIndex = 0;
  for (let i = 0; i < slotCount; i++) {
    if (result[i].ticker !== '' || saved?.[i] === '') {
      continue;
    }
    while (rankIndex < ranked.length) {
      const pick = ranked[rankIndex++];
      if (pick.ticker === '' || used.has(pick.ticker)) {
        continue;
      }
      used.add(pick.ticker);
      result[i] = pick;
      break;
    }
  }

  return result;
}

// Buy enough for ticks within the horizon, always covering at least the next tick.
// Advance stale snapshots on their original tick grid and subtract elapsed consumption.
// Do not cap purchases at storeCapacity; players may store excess outside the project.
export function upkeepBuyAmount(upkeep: UserData.GovBurnUpkeep, horizonDays: number, now: number) {
  if (upkeep.duration <= 0) {
    return Math.max(0, upkeep.amount - upkeep.stored);
  }
  const period = upkeep.duration * MS_IN_DAY;
  // A tick exactly at now still needs to be covered.
  const elapsedTicks = Math.max(0, Math.ceil((now - upkeep.nextTick) / period));
  const nextTick = upkeep.nextTick + elapsedTicks * period;
  const stored = Math.max(0, upkeep.stored - elapsedTicks * upkeep.amount);
  const ticksInHorizon = Math.floor((now + horizonDays * MS_IN_DAY - nextTick) / period) + 1;
  const ticksToCover = Math.max(1, ticksInHorizon);
  return Math.max(0, ticksToCover * upkeep.amount - stored);
}

// Combine selected upkeep purchases and CoGC refills into one material bill.
// The caller must resolve all slots before requesting a bill.
export function planetGovBurnBill(
  planet: UserData.GovBurnPlanet,
  slotsByBuilding: Record<string, SlotPick[]>,
  horizonDays: number,
  now: number,
) {
  const bill: Record<string, number> = {};
  for (const building of planet.buildings) {
    if (building.level <= 0) {
      continue;
    }
    const slots = slotsByBuilding[building.ticker];
    if (slots === undefined || slots.length === 0) {
      continue;
    }
    const upkeeps = building.upkeeps;
    if (upkeeps === undefined) {
      continue;
    }
    for (const slot of slots) {
      if (slot.ticker === '') {
        throw new Error(`Unresolved gov burn slot for ${building.ticker}`);
      }
      const upkeep = upkeeps.find(x => x.ticker === slot.ticker);
      if (!upkeep) {
        continue;
      }
      const amount = upkeepBuyAmount(upkeep, horizonDays, now);
      if (amount <= 0) {
        continue;
      }
      bill[slot.ticker] = (bill[slot.ticker] ?? 0) + amount;
    }
  }
  if (planet.cogc !== undefined) {
    for (const [ticker, amount] of Object.entries(cogcBuyAmounts(planet.cogc, horizonDays))) {
      bill[ticker] = (bill[ticker] ?? 0) + amount;
    }
  }
  return bill;
}

const COGC_PERIOD_DAYS = 10;

export function cogcPaid(cogc: UserData.GovBurnCogc) {
  return cogc.materials.length > 0 && cogc.materials.every(x => x.currentAmount >= x.amount);
}

// A paid cycle moves the next contribution deadline one period past dueDate.
export function cogcDays(cogc: UserData.GovBurnCogc, now: number) {
  const days = (cogc.dueDate - now) / MS_IN_DAY + (cogcPaid(cogc) ? COGC_PERIOD_DAYS : 0);
  return Math.max(0, days);
}

// Round the horizon up to whole 10-day CoGC refills, limited to 1–3 refills.
export function cogcRefills(horizonDays: number) {
  return clamp(Math.ceil(horizonDays / COGC_PERIOD_DAYS), 1, 3);
}

// Buy full refills without credit for current-cycle contributions.
export function cogcBuyAmounts(cogc: UserData.GovBurnCogc, horizonDays: number) {
  const refills = cogcRefills(horizonDays);
  const bill: Record<string, number> = {};
  for (const material of cogc.materials) {
    const amount = refills * material.amount;
    if (amount > 0) {
      bill[material.ticker] = amount;
    }
  }
  return bill;
}
