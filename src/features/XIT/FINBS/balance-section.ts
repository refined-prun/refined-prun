import { PartialBalanceSheet } from '@src/core/balance/balance-sheet';

type ValueGetter = (x: PartialBalanceSheet) => number | undefined;

export interface SectionData {
  name: string;
  chartId: string;
  coloredChange?: boolean;
  tooltip?: string;
  less?: boolean;
  excluded?: boolean;
  value: ValueGetter;
  children?: SectionData[];
}
