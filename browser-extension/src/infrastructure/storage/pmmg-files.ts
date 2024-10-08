// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parsePmmgUserData(pmmg: any): UserData.PmmgSettings | undefined {
  if (!pmmg.loaded_before) {
    return undefined;
  }

  const currency = getCurrency(pmmg.backup_pricing_scheme ?? 'AI1 ASK');

  const red = Number(pmmg.burn_thresholds?.[0] ?? 3);
  const yellow = Number(pmmg.burn_thresholds?.[1] ?? 7);
  const resupply = yellow + Number(pmmg.burn_green_buffer ?? 0);

  const threshold = Number(pmmg.repair_threshold ?? 70);
  const offset = Number(pmmg.repair_offset ?? 0);

  return {
    currency,
    burn: {
      red,
      yellow,
      resupply,
    },
    repair: {
      threshold,
      offset,
    },
    sidebar: pmmg.sidebar,
    sorting: pmmg.sorting?.map(parseSortingMode),
  };
}

function getCurrency(pricingMethod: string) {
  if (pricingMethod.startsWith('IC')) {
    return 'ǂ';
  }
  if (pricingMethod.startsWith('NC')) {
    return '₦';
  }
  if (pricingMethod.startsWith('CI')) {
    return '₡';
  }
  return '₳';
}

function parseSortingMode(mode: PmmgSortingMode): UserData.SortingMode {
  return {
    label: mode[0],
    storeId: mode[1],
    categories: mode[2].map(x => ({ name: x[0], materials: x[1] })),
    burn: mode[3],
    zero: mode[4],
  };
}

type PmmgSortingMode = [
  label: string,
  storeId: string,
  categories: [name: string, materials: string[]][],
  burn: boolean,
  zero: boolean,
];
