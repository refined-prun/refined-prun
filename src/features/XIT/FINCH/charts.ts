import { PartialBalanceSheet } from '@src/core/balance/balance-sheet';
import * as summary from '@src/core/balance/balance-sheet-summary';
import { userData } from '@src/store/user-data';

export type ChartDef = {
  value: string;
  label: string;
  getValue: (x: PartialBalanceSheet) => number | undefined;
  less?: boolean;
};

export const charts = computed<ChartDef[]>(() => {
  return [
    {
      value: 'EQUITY',
      label: userData.fullEquityMode ? 'Equity' : 'Equity (Partial)',
      getValue: summary.calcEquity,
    },

    // =========================
    // Assets
    // =========================
    {
      value: 'TOTAL ASSETS',
      label: 'Total Assets',
      getValue: summary.calcTotalAssets,
    },

    // =========================
    // Current Assets
    // =========================
    {
      value: 'CURRENT ASSETS',
      label: 'Current Assets',
      getValue: summary.calcTotalCurrentAssets,
    },
    {
      value: 'CA CASH EQUIVALENTS',
      label: '- Cash and Cash Equivalents',
      getValue: summary.calcTotalCashAndCashEquivalents,
    },
    {
      value: 'CA CASH',
      label: '-- Cash',
      getValue: x => x.assets?.current?.cashAndCashEquivalents?.cash,
    },
    {
      value: 'CA DEPOSITS',
      label: '-- Deposits',
      getValue: summary.calcTotalDeposits,
    },
    {
      value: 'CA DEPOSITS CX',
      label: '--- Deposits: CX',
      getValue: x => x.assets?.current?.cashAndCashEquivalents?.deposits?.cx,
    },
    {
      value: 'CA DEPOSITS FX',
      label: '--- Deposits: FX',
      getValue: x => x.assets?.current?.cashAndCashEquivalents?.deposits?.fx,
    },
    {
      value: 'CA MM MATERIALS',
      label: '-- MM Materials',
      getValue: x => x.assets?.current?.cashAndCashEquivalents?.mmMaterials,
    },
    {
      value: 'CA ACCOUNTS RECEIVABLE',
      label: '- Accounts Receivable',
      getValue: x => x.assets?.current?.accountsReceivable,
    },
    {
      value: 'CA LOANS RECEIVABLE',
      label: '- Loans Receivable',
      getValue: summary.calcTotalLoansReceivable,
    },
    {
      value: 'CA LOANS PRINCIPAL',
      label: '-- Loans Receivable: Principal',
      getValue: x => x.assets?.current?.loansReceivable?.principal,
    },
    {
      value: 'CA LOANS INTEREST',
      label: '-- Loans Receivable: Interest',
      getValue: x => x.assets?.current?.loansReceivable?.interest,
    },
    {
      value: 'CA INVENTORY',
      label: '- Inventory',
      getValue: summary.calcTotalInventory,
    },
    {
      value: 'CA CX LISTED MATERIALS',
      label: '-- CX-Listed Materials',
      getValue: x => x.assets?.current?.inventory?.cxListedMaterials,
    },
    {
      value: 'CA CX INVENTORY',
      label: '-- CX Inventory',
      getValue: x => x.assets?.current?.inventory?.cxInventory,
    },
    {
      value: 'CA MATERIALS IN TRANSIT',
      label: '-- Materials in Transit',
      getValue: x => x.assets?.current?.inventory?.materialsInTransit,
    },
    {
      value: 'CA BASE INVENTORY',
      label: '-- Base Inventory',
      getValue: summary.calcTotalBaseInventory,
    },
    {
      value: 'CA FINISHED GOODS',
      label: '--- Finished Goods',
      getValue: x => x.assets?.current?.inventory?.baseInventory?.finishedGoods,
    },
    {
      value: 'CA WORK IN PROGRESS',
      label: '--- Work-in-Progress (WIP)',
      getValue: x => x.assets?.current?.inventory?.baseInventory?.workInProgress,
    },
    {
      value: 'CA RAW MATERIALS',
      label: '--- Raw Materials',
      getValue: x => x.assets?.current?.inventory?.baseInventory?.rawMaterials,
    },
    {
      value: 'CA WORKFORCE CONSUMABLES',
      label: '--- Workforce Consumables',
      getValue: x => x.assets?.current?.inventory?.baseInventory?.workforceConsumables,
    },
    {
      value: 'CA OTHER ITEMS',
      label: '--- Other Items',
      getValue: x => x.assets?.current?.inventory?.baseInventory?.otherItems,
    },
    {
      value: 'CA FUEL TANKS',
      label: '-- Fuel Tanks',
      getValue: x => x.assets?.current?.inventory?.fuelTanks,
    },
    {
      value: 'CA MATERIALS RECEIVABLE',
      label: '-- Materials Receivable',
      getValue: x => x.assets?.current?.inventory?.materialsReceivable,
    },

    // =========================
    // Non-Current Assets
    // =========================
    {
      value: 'NON CURRENT ASSETS',
      label: 'Non-Current Assets',
      getValue: summary.calcTotalNonCurrentAssets,
    },
    {
      value: 'NCA BUILDINGS',
      label: '- Buildings, net',
      getValue: summary.calcTotalBuildings,
    },
    {
      value: 'NCA BUILDINGS VALUE',
      label: '-- Buildings Market Value',
      getValue: summary.calcTotalBuildingsMarketValue,
    },
    {
      value: 'NCA BUILDINGS INFRASTRUCTURE',
      label: '--- Buildings: Infrastructure',
      getValue: x => x.assets?.nonCurrent?.buildings?.marketValue?.infrastructure,
    },
    {
      value: 'NCA BUILDINGS RESOURCE EXTRACTION',
      label: '--- Buildings: Resource Extraction',
      getValue: x => x.assets?.nonCurrent?.buildings?.marketValue?.resourceExtraction,
    },
    {
      value: 'NCA BUILDINGS PRODUCTION',
      label: '--- Buildings: Production',
      getValue: x => x.assets?.nonCurrent?.buildings?.marketValue?.production,
    },
    {
      value: 'NCA BUILDINGS DEPRECIATION',
      label: '-- Buildings Acc. Depreciation',
      less: true,
      getValue: x => x.assets?.nonCurrent?.buildings?.accumulatedDepreciation,
    },
    {
      value: 'NCA SHIPS',
      label: '- Ships, net',
      getValue: summary.calcTotalShips,
    },
    {
      value: 'NCA SHIPS VALUE',
      label: '-- Ships Market Value',
      getValue: x => x.assets?.nonCurrent?.ships?.marketValue,
    },
    {
      value: 'NCA SHIPS DEPRECIATION',
      label: '-- Ships Acc. Depreciation',
      less: true,
      getValue: x => x.assets?.nonCurrent?.ships?.accumulatedDepreciation,
    },
    {
      value: 'NCA LONG TERM RECEIVABLES',
      label: '- Long-Term Receivables',
      getValue: summary.calcTotalLongTermReceivables,
    },
    {
      value: 'NCA ACCOUNTS RECEIVABLE',
      label: '-- LTR: Accounts Receivable',
      getValue: x => x.assets?.nonCurrent?.longTermReceivables?.accountsReceivable,
    },
    {
      value: 'NCA MATERIALS IN TRANSIT',
      label: '-- LTR: Materials in Transit',
      getValue: x => x.assets?.nonCurrent?.longTermReceivables?.materialsInTransit,
    },
    {
      value: 'NCA MATERIALS RECEIVABLE',
      label: '-- LTR: Materials Receivable',
      getValue: x => x.assets?.nonCurrent?.longTermReceivables?.materialsReceivable,
    },
    {
      value: 'NCA LOANS PRINCIPAL',
      label: '-- LTR: Loans Principal',
      getValue: x => x.assets?.nonCurrent?.longTermReceivables?.loansPrincipal,
    },
    {
      value: 'NCA INTANGIBLE ASSETS',
      label: '- Intangible Assets',
      getValue: summary.calcTotalIntangibleAssets,
    },
    {
      value: 'NCA HQ UPGRADES',
      label: '-- HQ Upgrades',
      getValue: x => x.assets?.nonCurrent?.intangibleAssets?.hqUpgrades,
    },
    {
      value: 'NCA ARC',
      label: '-- APEX Representation Center',
      getValue: x => x.assets?.nonCurrent?.intangibleAssets?.arc,
    },

    // =========================
    // Liabilities
    // =========================
    {
      value: 'TOTAL LIABILITIES',
      label: 'Total Liabilities',
      getValue: summary.calcTotalLiabilities,
    },

    // =========================
    // Current Liabilities
    // =========================
    {
      value: 'CURRENT LIABILITIES',
      label: 'Current Liabilities',
      getValue: summary.calcTotalCurrentLiabilities,
    },
    {
      value: 'CL ACCOUNTS PAYABLE',
      label: '- Accounts Payable',
      getValue: x => x.liabilities?.current?.accountsPayable,
    },
    {
      value: 'CL MATERIALS PAYABLE',
      label: '- Materials Payable',
      getValue: x => x.liabilities?.current?.materialsPayable,
    },
    {
      value: 'CL LOANS PAYABLE',
      label: '- Loans Payable',
      getValue: summary.calcTotalLoansPayable,
    },
    {
      value: 'CL LOANS PRINCIPAL',
      label: '-- Loans Payable: Principal',
      getValue: x => x.liabilities?.current?.loansPayable?.principal,
    },
    {
      value: 'CL LOANS INTEREST',
      label: '-- Loans Payable: Interest',
      getValue: x => x.liabilities?.current?.loansPayable?.interest,
    },

    // =========================
    // Non-Current Liabilities
    // =========================
    {
      value: 'NON CURRENT LIABILITIES',
      label: 'Non-Current Liabilities',
      getValue: summary.calcTotalNonCurrentLiabilities,
    },
    {
      value: 'NCL LONG TERM PAYABLES',
      label: '- Long-Term Payables',
      getValue: summary.calcTotalLongTermPayables,
    },
    {
      value: 'NCL ACCOUNTS PAYABLE',
      label: '-- Long-Term Accounts Payable',
      getValue: x => x.liabilities?.nonCurrent?.longTermPayables?.accountsPayable,
    },
    {
      value: 'NCL MATERIALS PAYABLE',
      label: '-- Long-Term Materials Payable',
      getValue: x => x.liabilities?.nonCurrent?.longTermPayables?.materialsPayable,
    },
    {
      value: 'NCL LOANS PRINCIPAL',
      label: '-- Long-Term Loans Principal',
      getValue: x => x.liabilities?.nonCurrent?.longTermPayables?.loansPrincipal,
    },
  ];
});
