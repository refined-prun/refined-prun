import { PartialBalanceSheet } from '@src/core/balance/balance-sheet';
import { map } from '@src/utils/map-values';
import { sum } from '@src/utils/sum';

interface BalanceSheetSection {
  [key: string]: BalanceSheetSection | number | undefined;

  total?: number;
}

function calcSectionTotal<T extends BalanceSheetSection>(
  section?: T,
  ...args: ((section: T) => number | undefined)[]
) {
  if (section === undefined) {
    return undefined;
  }

  if (section.total !== undefined) {
    return section.total;
  }

  return section.total ?? mapSum(...args.map(x => x(section)));
}

function less(value: number | undefined) {
  return value !== undefined ? -value : value;
}

export function calcTotalDeposits(sheet: PartialBalanceSheet) {
  return calcSectionTotal(
    sheet.assets?.current?.cashAndCashEquivalents?.deposits,
    x => x.cx,
    x => x.fx,
  );
}

export function calcTotalCashAndCashEquivalents(sheet: PartialBalanceSheet) {
  return calcSectionTotal(
    sheet.assets?.current?.cashAndCashEquivalents,
    x => x.cash,
    () => calcTotalDeposits(sheet),
    x => x.mmMaterials,
  );
}

export function calcTotalLoansReceivable(sheet: PartialBalanceSheet) {
  return calcSectionTotal(
    sheet.assets?.current?.loansReceivable,
    x => x.principal,
    x => x.interest,
  );
}

export function calcTotalBaseInventory(sheet: PartialBalanceSheet) {
  return calcSectionTotal(
    sheet.assets?.current?.inventory?.baseInventory,
    x => x.finishedGoods,
    x => x.workInProgress,
    x => x.rawMaterials,
    x => x.workforceConsumables,
    x => x.otherItems,
  );
}

export function calcTotalInventory(sheet: PartialBalanceSheet) {
  return calcSectionTotal(
    sheet.assets?.current?.inventory,
    x => x.cxListedMaterials,
    x => x.cxInventory,
    x => x.materialsInTransit,
    () => calcTotalBaseInventory(sheet),
    x => x.fuelTanks,
    x => x.materialsReceivable,
  );
}

export function calcTotalCurrentAssets(sheet: PartialBalanceSheet) {
  return calcSectionTotal(
    sheet.assets?.current,
    () => calcTotalCashAndCashEquivalents(sheet),
    x => x.accountsReceivable,
    () => calcTotalLoansReceivable(sheet),
    () => calcTotalInventory(sheet),
  );
}

export function calcTotalBuildingsMarketValue(sheet: PartialBalanceSheet) {
  return calcSectionTotal(
    sheet.assets?.nonCurrent?.buildings?.marketValue,
    x => x.infrastructure,
    x => x.resourceExtraction,
    x => x.production,
  );
}

export function calcTotalBuildings(sheet: PartialBalanceSheet) {
  return calcSectionTotal(
    sheet.assets?.nonCurrent?.buildings,
    () => calcTotalBuildingsMarketValue(sheet),
    x => less(x.accumulatedDepreciation),
  );
}

export function calcTotalShips(sheet: PartialBalanceSheet) {
  return calcSectionTotal(
    sheet.assets?.nonCurrent?.ships,
    x => x.marketValue,
    x => less(x.accumulatedDepreciation),
  );
}

export function calcTotalLongTermReceivables(sheet: PartialBalanceSheet) {
  return calcSectionTotal(
    sheet.assets?.nonCurrent?.longTermReceivables,
    x => x.accountsReceivable,
    x => x.materialsInTransit,
    x => x.materialsReceivable,
    x => x.loansPrincipal,
  );
}

export function calcTotalIntangibleAssets(sheet: PartialBalanceSheet) {
  return calcSectionTotal(
    sheet.assets?.nonCurrent?.intangibleAssets,
    x => x.hqUpgrades,
    x => x.arc,
  );
}

export function calcTotalNonCurrentAssets(sheet: PartialBalanceSheet) {
  return calcSectionTotal(
    sheet.assets?.nonCurrent,
    () => calcTotalBuildings(sheet),
    () => calcTotalShips(sheet),
    () => calcTotalLongTermReceivables(sheet),
    () => calcTotalIntangibleAssets(sheet),
  );
}

export function calcTotalAssets(sheet: PartialBalanceSheet) {
  return calcSectionTotal(
    sheet.assets,
    () => calcTotalCurrentAssets(sheet),
    () => calcTotalNonCurrentAssets(sheet),
  );
}

export function calcTotalLoansPayable(sheet: PartialBalanceSheet) {
  return calcSectionTotal(
    sheet.liabilities?.current?.loansPayable,
    x => x.principal,
    x => x.interest,
  );
}

export function calcTotalCurrentLiabilities(sheet: PartialBalanceSheet) {
  return calcSectionTotal(
    sheet.liabilities?.current,
    x => x.accountsPayable,
    x => x.materialsPayable,
    () => calcTotalLoansPayable(sheet),
  );
}

export function calcTotalLongTermPayables(sheet: PartialBalanceSheet) {
  return calcSectionTotal(
    sheet.liabilities?.nonCurrent?.longTermPayables,
    x => x.accountsPayable,
    x => x.materialsPayable,
    x => x.loansPrincipal,
  );
}

export function calcTotalNonCurrentLiabilities(sheet: PartialBalanceSheet) {
  return calcSectionTotal(sheet.liabilities?.nonCurrent, () => calcTotalLongTermPayables(sheet));
}

export function calcTotalLiabilities(sheet: PartialBalanceSheet) {
  return calcSectionTotal(
    sheet.liabilities,
    () => calcTotalCurrentLiabilities(sheet),
    () => calcTotalNonCurrentLiabilities(sheet),
  );
}

export function calcEquity(sheet: PartialBalanceSheet) {
  return sheet.equity ?? mapSum(calcTotalAssets(sheet), less(calcTotalLiabilities(sheet)));
}

export function calcLiquidationValue(sheet: PartialBalanceSheet) {
  return mapSum(
    calcEquity(sheet),
    less(calcTotalShips(sheet)),
    less(calcTotalIntangibleAssets(sheet)),
  );
}

export function calcQuickAssets(sheet: PartialBalanceSheet) {
  return mapSum(
    calcTotalCashAndCashEquivalents(sheet),
    calcTotalLoansReceivable(sheet),
    sheet?.assets?.current?.accountsReceivable,
  );
}

export function calcQuickLiabilities(sheet: PartialBalanceSheet) {
  return mapSum(calcTotalLoansPayable(sheet), sheet?.liabilities?.current?.accountsPayable);
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
