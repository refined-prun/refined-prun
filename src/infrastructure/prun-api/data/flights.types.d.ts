declare namespace PrunApi {
  export interface Flight {
    id: string;
    shipId: string;
    origin: Address;
    destination: Address;
    departure: DateTime;
    arrival: DateTime;
    segments: FlightSegment[];
    currentSegmentIndex: number;
    stlDistance: number;
    ftlDistance: number;
    aborted: boolean;
  }

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

  export interface FlightSegment {
    type: SegmentType;
    origin: Address;
    departure: DateTime;
    destination: Address;
    arrival: DateTime;
    stlDistance: number | null;
    stlFuelConsumption: number | null;
    transferEllipse: TransferEllipse | null;
    ftlDistance: number | null;
    ftlFuelConsumption: number | null;
    damage: number;
  }

  export interface TransferEllipse {
    startPosition: Position;
    targetPosition: Position;
    center: Position;
    alpha: number;
    semiMajorAxis: number;
    semiMinorAxis: number;
  }

  declare type SegmentType =
    | 'TAKE_OFF'
    | 'LANDING'
    | 'DEPARTURE'
    | 'APPROACH'
    | 'TRANSIT'
    | 'JUMP'
    | 'CHARGE';
}
