declare namespace PrunApi {
  export interface Blueprint {
    id: string;
    naturalId: string;
    created: DateTime;
    name: string;
    billOfMaterial: MaterialQuantities;
    status: string;
    selections: BlueprintSelection[];
    performance: { [key: string]: number };
    buildTime: number;
  }

  export interface BlueprintSelection {
    id: string;
    type: string;
    cardinality: Cardinality;
    option: string;
    optionMaterialId: null | string;
    optionMaterialName: null | string;
    amount: number;
    modifiers: BlueprintSelectionModifier[];
  }

  declare type Cardinality = 'ONE' | 'ONE_OR_MANY' | 'ZERO_OR_MANY' | 'ZERO_OR_ONE';

  export interface BlueprintSelectionModifier {
    type: string;
    value: number;
  }
}
