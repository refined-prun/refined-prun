import { PartialBalanceSheet } from '@src/core/balance/balance-sheet';

export interface SectionData {
  name: string;
  important?: boolean;
  total: (x: PartialBalanceSheet) => number | undefined;
  rows: [string, (x: PartialBalanceSheet) => number | undefined][];
}
