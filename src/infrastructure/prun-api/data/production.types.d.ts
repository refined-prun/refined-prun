declare namespace PrunApi {
  interface ProductionLine {
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

  interface EfficiencyFactor {
    expertiseCategory?: string;
    type: EfficiencyFactorType;
    effectivity: number;
    value: number;
  }

  type EfficiencyFactorType =
    | 'EXPERTS'
    | 'COGC_PROGRAM'
    | 'PRODUCTION_LINE_CONDITION'
    | 'COMPANY_HEADQUARTERS'
    | 'FERTILITY';

  interface ProductionOrder {
    id: string;
    productionLineId: string;
    inputs: MaterialAmountValue[];
    outputs: MaterialAmountValue[];
    created: DateTime;
    started: DateTime | null;
    completion: DateTime | null;
    duration: TimeSpan | null;
    lastUpdated: DateTime | null;
    completed: number;
    halted: boolean;
    productionFee: CurrencyAmount;
    productionFeeCollector: ProductionFeeCollector;
    recurring: boolean;
    recipeId: string;
  }

  interface ProductionFeeCollector {
    currency: Currency;
  }

  interface ProductionTemplate {
    id: string;
    name: string;
    inputFactors: ProductionFactor[];
    outputFactors: ProductionFactor[];
    experience: number;
    effortFactor: number;
    efficiency: number;
    duration: TimeSpan;
    productionFeeFactor: CurrencyAmount;
    productionFeeCollector: ProductionFeeCollector;
  }

  interface ProductionFactor {
    material: Material;
    factor: number;
  }

  interface ProductionWorkforce {
    level: string;
    efficiency: number;
  }
}
