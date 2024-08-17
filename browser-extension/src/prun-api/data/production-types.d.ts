declare namespace PrunApi {
  export interface ProductionLine {
    id: string;
    siteId: string;
    address: Address;
    type: string;
    capacity: number;
    slots: number;
    efficiency: number;
    condition: number;
    workforces: ProductionWorkforce[];
    orders: ProductionOrder[];
    productionTemplates: ProductionTemplate[];
    efficiencyFactors: EfficiencyFactor[];
  }

  export interface EfficiencyFactor {
    expertiseCategory?: string;
    type: string;
    effectivity: number;
    value: number;
  }

  export interface ProductionOrder {
    id: string;
    productionLineId: string;
    inputs: MaterialAmountValue[];
    outputs: MaterialAmountValue[];
    created: DateTime;
    started: DateTime | null;
    completion: DateTime | null;
    duration: TimeSpan;
    lastUpdated: DateTime | null;
    completed: number;
    halted: boolean;
    productionFee: CurrencyAmount;
    productionFeeCollector: ProductionFeeCollector;
    recurring: boolean;
  }

  export interface ProductionFeeCollector {
    currency: Currency;
  }

  export interface ProductionTemplate {
    id: string;
    name: string;
    inputFactors: ProductionFactor[];
    outputFactors: ProductionFactor[];
    effortFactor: number;
    efficiency: number;
    duration: TimeSpan;
    productionFeeFactor: CurrencyAmount;
    productionFeeCollector: ProductionFeeCollector;
  }

  export interface ProductionFactor {
    material: Material;
    factor: number;
  }

  export interface ProductionWorkforce {
    level: string;
    efficiency: number;
  }
}
