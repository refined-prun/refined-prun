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

interface ShipEntry {
  id: string;
  idShipStore: string;
  idStlFuelStore: string;
  idFtlFuelStore: string;
  registration: string;
  name: string;
  commissioningTime: CommissioningTime;
  blueprintNaturalId: string;
  address: null;
  flightId: string;
  acceleration: number;
  thrust: number;
  mass: number;
  operatingEmptyMass: number;
  volume: number;
  reactorPower: number;
  emitterPower: number;
  stlFuelStoreId: string;
  stlFuelFlowRate: number;
  ftlFuelStoreId: string;
  operatingTimeStl: OperatingTime;
  operatingTimeFtl: OperatingTime;
  condition: number;
  lastRepair: null;
  repairMaterials: RepairMaterial[];
  status: string;
}

interface CommissioningTime {
  timestamp: number;
}

interface OperatingTime {
  millis: number;
}

interface RepairMaterial {
  material: Material;
  amount: number;
}

interface Material {
  name: string;
  id: string;
  ticker: string;
  category: string;
  weight: number;
  volume: number;
  resource: boolean;
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
  ships: [] as ShipEntry[],
};
