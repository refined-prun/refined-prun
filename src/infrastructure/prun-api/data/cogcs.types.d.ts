declare namespace PrunApi {
  interface Cogc {
    id: string;
    planet: AddressEntity;
    status: string;
    upkeep: CogcUpkeep | null;
  }

  interface CogcUpkeep {
    billOfMaterial: CogcBillEntry[];
    contributions: PopulationProjectContribution[];
    dueDate: DateTime;
  }

  interface CogcBillEntry {
    material: Material;
    amount: number;
    currentAmount: number;
  }
}
