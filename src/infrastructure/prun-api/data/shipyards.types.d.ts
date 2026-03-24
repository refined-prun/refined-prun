declare namespace PrunApi {
  interface Shipyard {
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

  interface ShipyardOperator {
    currency: Currency;
  }
}
