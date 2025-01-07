declare namespace PrunApi {
  export interface FlightPlan {
    missionId: string;
    segments: FlightSegment[];
    status: string;
    eta: TimeSpan;
    chargeTime: TimeSpan;
    stlDistance: number | null;
    stlFuelConsumption: number | null;
    ftlDistance: number | null;
    ftlFuelConsumption: number | null;
    minReactorUsageFactor: number;
    maxReactorUsageFactor: number;
  }
}
