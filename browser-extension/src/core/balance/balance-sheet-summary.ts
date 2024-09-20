import { PartialBalanceSheet } from '@src/core/balance/balance-sheet';
import { map } from '@src/utils/map-values';
import { sum } from '@src/utils/sum';

export function calcTotalCurrentAssets(sheet: PartialBalanceSheet) {
  const assets = sheet.currentAssets;
  if (!assets) {
    return undefined;
  }

  return (
    assets.total ??
    mapSum(
      assets.cash,
      assets.deposits,
      assets.interestReceivable,
      assets.accountsReceivable,
      assets.shortTermLoans,
      assets.marketListedMaterials,
      assets.inventory,
      assets.ordersInProgress,
      assets.materialsToReceive,
    )
  );
}

export function calcTotalNonCurrentAssets(sheet: PartialBalanceSheet) {
  const assets = sheet.nonCurrentAssets;
  if (!assets) {
    return undefined;
  }

  return (
    assets.total ??
    mapSum(
      assets.buildings,
      assets.accountsReceivable,
      assets.longTermLoans,
      assets.materialsToReceive,
    )
  );
}

export function calcTotalAssets(sheet: PartialBalanceSheet) {
  return (
    sheet.totalAssets ?? mapSum(calcTotalCurrentAssets(sheet), calcTotalNonCurrentAssets(sheet))
  );
}

export function calcTotalCurrentLiabilities(sheet: PartialBalanceSheet) {
  const liabilities = sheet.currentLiabilities;
  if (!liabilities) {
    return undefined;
  }

  return (
    liabilities.total ??
    mapSum(
      liabilities.accountsPayable,
      liabilities.materialsToDeliver,
      liabilities.shortTermDebt,
      liabilities.interestPayable,
    )
  );
}

export function calcTotalNonCurrentLiabilities(sheet: PartialBalanceSheet) {
  const liabilities = sheet.nonCurrentLiabilities;
  if (!liabilities) {
    return undefined;
  }

  return (
    liabilities.total ??
    mapSum(liabilities.accountsPayable, liabilities.materialsToDeliver, liabilities.longTermDebt)
  );
}

export function calcTotalLiabilities(sheet: PartialBalanceSheet) {
  return (
    sheet.totalLiabilities ??
    mapSum(calcTotalCurrentLiabilities(sheet), calcTotalNonCurrentLiabilities(sheet))
  );
}

export function calcTotalLockedAssets(sheet: PartialBalanceSheet) {
  const assets = sheet.lockedAssets;
  if (!assets) {
    return undefined;
  }

  return assets.total ?? mapSum(assets.ships, assets.hqUpgrades, assets.arc);
}

export function calcEquity(sheet: PartialBalanceSheet) {
  return (
    sheet.equity ?? map([calcTotalAssets(sheet), calcTotalLiabilities(sheet)], (x, y) => x - y)
  );
}

export function calcCompanyValue(sheet: PartialBalanceSheet) {
  return sheet.companyValue ?? map([calcEquity(sheet), calcTotalLockedAssets(sheet)], sum);
}

export function calcQuickAssets(sheet: PartialBalanceSheet) {
  const assets = sheet.currentAssets;
  if (!assets) {
    return undefined;
  }

  return mapSum(
    assets.cash,
    assets.deposits,
    assets.interestReceivable,
    assets.accountsReceivable,
    assets.shortTermLoans,
  );
}

export function calcQuickLiabilities(sheet: PartialBalanceSheet) {
  const liabilities = sheet.currentLiabilities;
  if (!liabilities) {
    return undefined;
  }

  return mapSum(
    liabilities.accountsPayable,
    liabilities.shortTermDebt,
    liabilities.interestPayable,
  );
}

export function calcAcidTestRatio(sheet: PartialBalanceSheet) {
  return map([calcQuickAssets(sheet), calcQuickLiabilities(sheet)], (x, y) => x / y);
}

export function calcWorkingCapitalRatio(sheet: PartialBalanceSheet) {
  return map([calcTotalCurrentAssets(sheet), calcTotalCurrentLiabilities(sheet)], (x, y) => x / y);
}

export function calcDebtRatio(sheet: PartialBalanceSheet) {
  return map([calcTotalLiabilities(sheet), calcTotalAssets(sheet)], (x, y) => x / y);
}

export function calcDebtToEquityRatio(sheet: PartialBalanceSheet) {
  return map([calcTotalLiabilities(sheet), calcEquity(sheet)], (x, y) => x / y);
}

function mapSum(...args: (number | undefined)[]) {
  return map(args, sum);
}
