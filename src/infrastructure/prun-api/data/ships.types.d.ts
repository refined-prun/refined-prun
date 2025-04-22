declare namespace PrunApi {
  interface Ship {
    id: string;
    idShipStore: string;
    idStlFuelStore: string;
    idFtlFuelStore: string;
    registration: string;
    name: string;
    commissioningTime: DateTime;
    blueprintNaturalId: string;
    address: Address | null;
    flightId: string | null;
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
    lastRepair: DateTime | null;
    repairMaterials: MaterialAmount[];
    status: string;
  }
}
