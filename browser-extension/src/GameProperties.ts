/**
 * A list of the material names and their corresponding ticker, weight, and volume. Makes it easier to reference FIO data
 *
 */

export const CurrencySymbols = {
  CIS: '₡',
  AIC: '₳',
  NCC: '₦',
  ICA: 'ǂ',
  ECD: '€',
};
export const RatingColors = {
  P: '#1b6b9c',
  U: '#8b211e',
  F: '#e26c37',
  E: '#e7782b',
  D: '#e87d28',
  C: '#ed891c',
  B: '#f19510',
  A: '#f6a204',
};

export const Consumption = {
  PIO: {
    RAT: 4,
    DW: 4,
    OVE: 0.5,
    PWO: 0.2,
    COF: 0.5,
  },
  SET: {
    DW: 5,
    RAT: 6,
    EXO: 0.5,
    PT: 0.5,
    KOM: 1,
    REP: 0.2,
  },
  TEC: {
    DW: 7.5,
    RAT: 7,
    MED: 0.5,
    HMS: 0.5,
    SCN: 0.1,
    ALE: 1,
    SC: 0.1,
  },
  ENG: {
    DW: 10,
    MED: 0.5,
    FIM: 7,
    HSS: 0.2,
    PDA: 0.1,
    VG: 0.2,
    GIN: 1,
  },
  SCI: {
    DW: 10,
    MED: 0.5,
    MEA: 7,
    LC: 0.2,
    WS: 0.1,
    WIN: 1,
    NST: 0.1,
  },
};

export const Exchanges = {
  'Antares Station Commodity Exchange': 'ANT',
  'Benten Station Commodity Exchange': 'BEN',
  'Moria Station Commodity Exchange': 'MOR',
  'Hortus Station Commodity Exchange': 'HRT',
  'Hubur Commodity Exchange': 'HUB',
  'Arclight Commodity Exchange': 'ARC',
};
export const ExchangeTickers = {
  ANT: 'AI1',
  BEN: 'CI1',
  MOR: 'NC1',
  HRT: 'IC1',
  HUB: 'NC2',
  ARC: 'CI2',
};
export const ExchangeTickersReverse = {
  AI1: 'ANT',
  CI1: 'BEN',
  NC1: 'MOR',
  IC1: 'HRT',
  NC2: 'HUB',
  CI2: 'ARC',
};
export const Stations = {
  'Antares Station': 'ANT',
  'Benten Station': 'BEN',
  'Moria Station': 'MOR',
  'Hortus Station': 'HRT',
  'Hubur Station': 'HUB',
  'Arclight Station': 'ARC',
};

export const NonProductionBuildings = [
  'CM',
  'HB1',
  'HB2',
  'HB3',
  'HB4',
  'HB5',
  'HBB',
  'HBC',
  'HBL',
  'HBM',
  'STO',
];

export const FriendlyNames = {
  LocalMarketAds: 'LM Unit Prices',
  OrderETAs: 'Order ETAs',
  FlightETAs: 'Flight Planning ETAs',
  ShippingAds: 'LM Shipping Rates',
  PostLM: 'LM Posting Unit Price',
  ContractDrafts: 'CONTD Unit Prices',
  QueueLoad: 'Queue Percent Display',
  ConsumableTimers: 'Workforce Consumable Burn',
  FleetETAs: 'Fleet ETAs',
  Notifications: 'Notifications',
  ScreenUnpack: 'Screen Unpack',
  ImageCreator: 'Chat Image Creator',
  InventoryOrganizer: 'Inventory Sorting',
  CommandCorrecter: 'Command Correcter',
  CalculatorButton: 'Calculator Button',
  Sidebar: 'Sidebar',
  HeaderMinimizer: 'Minimize Headers (Master)',
  PendingContracts: 'Pending Contracts',
  CompactUI: 'Compact UI',
  FormulaReplacer: 'Formula Replacer',
  AdvancedMode: 'Advanced Minimialist Mode (Master)',
  CXOBHighlighter: 'CXOB Name Highlighter',
  CXPOOrderBook: 'CXPO Order Book',
  ChatDeleteButton: 'Toggle Chat Delete (Master)',
};

export const SortingTriangleHTML = `
<div title=""><svg aria-hidden="true" width="10" height="10" role="img" version="1.1" fill="currentcolor" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" style="vertical-align: middle;"><g><path d="M.88681 1.097752l12.13774 21.02318L25.422964 1.105446z"></path></g></svg></div>`;
