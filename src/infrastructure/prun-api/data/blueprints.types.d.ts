declare namespace PrunApi {
  interface Blueprint {
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

  interface BlueprintSelection {
    id: string;
    type: string;
    cardinality: Cardinality;
    option: string;
    optionMaterialId: null | string;
    optionMaterialName: null | string;
    amount: number;
    modifiers: BlueprintSelectionModifier[];
  }

  type Cardinality = 'ONE' | 'ONE_OR_MANY' | 'ZERO_OR_MANY' | 'ZERO_OR_ONE';

  interface BlueprintSelectionModifier {
    type: string;
    value: number;
  }
}
