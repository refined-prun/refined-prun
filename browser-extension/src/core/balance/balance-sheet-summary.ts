import { PartialBalanceSheet } from '@src/core/balance/balance-sheet';

export function calcTotalCurrentAssets(sheet: PartialBalanceSheet) {
  const assets = sheet.currentAssets;
  if (!assets) {
    return 0;
  }

  return (
    assets.total ??
    sumPartial(
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
    return 0;
  }

  return (
    assets.total ??
    sumPartial(
      assets.buildings,
      assets.accountsReceivable,
      assets.longTermLoans,
      assets.materialsToReceive,
    )
  );
}

export function calcTotalAssets(sheet: PartialBalanceSheet) {
  return (
    sheet.totalAssets ?? sumPartial(calcTotalCurrentAssets(sheet), calcTotalNonCurrentAssets(sheet))
  );
}

export function calcTotalCurrentLiabilities(sheet: PartialBalanceSheet) {
  const liabilities = sheet.currentLiabilities;
  if (!liabilities) {
    return 0;
  }

  return (
    liabilities.total ??
    sumPartial(
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
    return 0;
  }

  return (
    liabilities.total ??
    sumPartial(
      liabilities.accountsPayable,
      liabilities.materialsToDeliver,
      liabilities.longTermDebt,
    )
  );
}

export function calcTotalLiabilities(sheet: PartialBalanceSheet) {
  return (
    sheet.totalLiabilities ??
    sumPartial(calcTotalCurrentLiabilities(sheet), calcTotalNonCurrentLiabilities(sheet))
  );
}

export function calcTotalLockedAssets(sheet: PartialBalanceSheet) {
  const assets = sheet.lockedAssets;
  if (!assets) {
    return 0;
  }

  return assets.total ?? sumPartial(assets.ships, assets.hqUpgrades, assets.arc);
}

export function calcEquity(sheet: PartialBalanceSheet) {
  return sheet.equity ?? calcTotalAssets(sheet) - calcTotalLiabilities(sheet);
}

export function calcCompanyValue(sheet: PartialBalanceSheet) {
  return sheet.companyValue ?? calcEquity(sheet) + calcTotalLockedAssets(sheet);
}

export function calcQuickAssets(sheet: PartialBalanceSheet) {
  const assets = sheet.currentAssets;
  if (!assets) {
    return 0;
  }

  return sumPartial(
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
    return 0;
  }

  return sumPartial(
    liabilities.accountsPayable,
    liabilities.shortTermDebt,
    liabilities.interestPayable,
  );
}

export function calcAcidTestRatio(sheet: PartialBalanceSheet) {
  return calcQuickAssets(sheet) / calcQuickLiabilities(sheet);
}

export function calcWorkingCapitalRatio(sheet: PartialBalanceSheet) {
  return calcTotalCurrentAssets(sheet) / calcTotalCurrentLiabilities(sheet);
}

export function calcDebtRatio(sheet: PartialBalanceSheet) {
  return calcTotalLiabilities(sheet) / calcTotalAssets(sheet);
}

export function calcDebtToEquityRatio(sheet: PartialBalanceSheet) {
  return calcTotalLiabilities(sheet) / calcEquity(sheet);
}

function sumPartial(...args: (number | undefined)[]) {
  let sum = 0;
  // TODO: undefined if no all undefined args
  for (const arg of args) {
    sum += arg ?? 0;
  }
  return sum;
}
