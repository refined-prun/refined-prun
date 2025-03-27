declare namespace PrunApi {
  interface Flight {
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

  interface FlightSegment {
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

  interface TransferEllipse {
    startPosition: Position;
    targetPosition: Position;
    center: Position;
    alpha: number;
    semiMajorAxis: number;
    semiMinorAxis: number;
  }

  type SegmentType =
    | 'TAKE_OFF'
    | 'LANDING'
    | 'DEPARTURE'
    | 'APPROACH'
    | 'TRANSIT'
    | 'JUMP'
    | 'CHARGE';
}
