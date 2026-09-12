declare namespace PrunApi {
  interface PopulationProject {
    id: string;
    type: string;
    projectIdentifier: string;
    level: number;
    activeLevel: number;
    currentLevel: number;
    upkeeps: PopulationProjectUpkeep[];
    contributions: PopulationProjectContribution[];
  }

  interface PopulationProjectUpkeep {
    stored: number;
    storeCapacity: number;
    duration: number;
    nextTick: DateTime;
    material: Material;
    amount: number;
    currentAmount: number;
  }

  interface PopulationProjectContribution {
    materials: MaterialAmount[];
    time: DateTime;
    contributor: { id: string; name: string; code?: string };
  }
}
