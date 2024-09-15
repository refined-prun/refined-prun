declare namespace PrunApi {
  export interface Shipyard {
    address: Address;
    operator: ShipyardOperator;
    createdProjects: number;
    activeProjectsTotal: number;
    finishedProjectsTotal: number;
    finishedProjectsWeek: number;
    finishedProjectsMonth: number;
    finishedProjectsSemiannually: number;
    id: string;
  }

  export interface ShipyardOperator {
    currency: Currency;
  }
}
