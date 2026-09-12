declare namespace PrunApi {
  interface Population {
    id: string;
    infrastructure: PopulationInfrastructure[];
  }

  interface PopulationInfrastructure {
    type: string;
    ticker: string;
    projectId: string;
    projectName: string;
    level: number;
    activeLevel: number;
    currentLevel: number;
    upkeepStatus: number;
    upgradeStatus: number;
  }
}
