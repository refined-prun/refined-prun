type Currency = 'AIC' | 'ICA' | 'NCC' | 'CIS' | 'ECD';

interface CXOBOrder {
  id: string;
  trader: {
    id: string;
    name: string;
    code: string;
  };
  amount: number;
  limit: {
    amount: number;
    currency: Currency;
  };
}

interface CXOBEntry {
  timestamp: number;
  supply: number;
  demand: number;
  traded: number;
  buyingOrders: CXOBOrder[];
  sellingOrders: CXOBOrder[];
}

interface FXOSEntry {
  id: string;
  type: 'SELLING' | 'BUYING';
  initialAmount: {
    amount: number;
    currency: Currency;
  };
  amount: {
    amount: number;
    currency: Currency;
  };
  limit: {
    base: Currency;
    quote: Currency;
    rate: number;
    decimals: number;
  };
  created: {
    timestamp: number;
  };
  status: 'PLACED' | 'FILLED';
  trades: [];
}

export const userData = {
  sites: [],
  storage: [],
  workforce: [],
  contracts: [],
  production: [],
  currency: [],
  cxos: [],
  fxos: [] as FXOSEntry[],
  cxob: {} as { [key: string]: CXOBEntry },
  ships: {},
};
