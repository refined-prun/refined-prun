import { PartialBalanceSheet } from '@src/core/balance/balance-sheet';

type ValueGetter = (x: PartialBalanceSheet) => number | undefined;

export interface SectionData {
  name: string;
  coloredTotal?: boolean;
  total: ValueGetter;
  children: RowData[];
}

export interface RowData {
  name: string;
  less?: boolean;
  value: ValueGetter;
  children?: RowData[];
}
