declare namespace PrunApi {
  interface Address {
    lines: AddressLine[];
  }

  interface UnknownAddressLine {
    type: string;
    entity?: AddressEntity;
    orbit?: AddressOrbit;
  }

  interface SystemAddressLine extends UnknownAddressLine {
    type: 'SYSTEM';
    entity: AddressEntity;
  }

  interface StationAddressLine extends UnknownAddressLine {
    type: 'STATION';
    entity: AddressEntity;
  }

  interface PlanetAddressLine extends UnknownAddressLine {
    type: 'PLANET';
    entity: AddressEntity;
  }

  interface OrbitAddressLine extends UnknownAddressLine {
    type: 'ORBIT';
    orbit: AddressOrbit;
  }

  type AddressLine =
    | SystemAddressLine
    | StationAddressLine
    | PlanetAddressLine
    | OrbitAddressLine
    | UnknownAddressLine;

  interface AddressEntity {
    id: string;
    naturalId: string;
    name: string;
  }

  interface AddressOrbit {
    semiMajorAxis: number;
    eccentricity: number;
    inclination: number;
    rightAscension: number;
    periapsis: number;
  }
}
