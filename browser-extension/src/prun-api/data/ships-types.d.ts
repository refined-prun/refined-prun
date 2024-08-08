declare module PrunApi {
  export interface Ship {
    id: string;
    idShipStore: string;
    idStlFuelStore: string;
    idFtlFuelStore: string;
    registration: string;
    name: string;
    commissioningTime: DateTime;
    blueprintNaturalId: string;
    address: Address | null;
    flightId: string;
    acceleration: number;
    thrust: number;
    mass: number;
    operatingEmptyMass: number;
    volume: number;
    reactorPower: number;
    emitterPower: number;
    stlFuelStoreId: string;
    stlFuelFlowRate: number;
    ftlFuelStoreId: string;
    operatingTimeStl: TimeSpan;
    operatingTimeFtl: TimeSpan;
    condition: number;
    lastRepair: number | null;
    repairMaterials: MaterialAmount[];
    status: string;
  }
}
