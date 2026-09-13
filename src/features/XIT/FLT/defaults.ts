export type SortKey =
  | 'name'
  | 'cargo'
  | 'status'
  | 'eta'
  | 'fuel'
  | 'none'
  | 'repair'
  | 'size'
  | 'shipClass';
export type SortDirection = 'asc' | 'desc' | 'none';
export type LayoutMode = 'compact' | 'whitespace' | 'cargo' | 'legacy';
export type FuelAlertThreshold = '75' | '50' | '35' | '25' | '10';
export type FuelAlertFilter = 'any' | FuelAlertThreshold;

export const DEFAULT_SORT_DIRECTION_BY_KEY: Record<SortKey, SortDirection> = {
  name: 'none',
  cargo: 'none',
  status: 'desc',
  eta: 'asc',
  fuel: 'none',
  none: 'none',
  repair: 'none',
  size: 'none',
  shipClass: 'asc',
};

export const DEFAULTS = {
  primarySortKey: 'status' as SortKey,
  secondarySortKey: 'eta' as SortKey,
  showStlShips: true,
  showFtlShips: true,
  showInFlightShips: true,
  showNotInFlightShips: true,
  hideReturningToCx: false,
  fuelAlertFilter: 'any' as FuelAlertFilter,
  layoutMode: 'cargo' as LayoutMode,
  showColName: true,
  showColShipClass: false,
  showColSize: false,
  showColCargo: true,
  showColCargoSize: false,
  showColTime: true,
  showColRepair: false,
  showColFuel: true,
  showColProblems: false,
  problemFuelThreshold: '50' as FuelAlertFilter,
};
