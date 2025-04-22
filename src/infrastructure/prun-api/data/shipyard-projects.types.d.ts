declare namespace PrunApi {
  interface ShipyardProject {
    id: string;
    creation: DateTime;
    start: DateTime | null;
    end: DateTime | null;
    blueprintNaturalId: string;
    originBlueprintNaturalId: string;
    shipyardId: string;
    status: ShipyardProjectStatus;
    canStart: boolean;
    inventory: ProjectInventory;
    shipId: null | string;
  }

  type ShipyardProjectStatus = 'CREATED' | 'STARTED' | 'BUILT';
}
