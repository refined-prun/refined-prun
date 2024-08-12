declare namespace PrunApi {
  export interface Address {
    lines: AddressLine[];
  }

  export interface AddressLine {
    entity: AddressEntity;
    type: AddressLineType;
    orbit?: AddressOrbit;
  }

  export interface AddressEntity {
    id: string;
    naturalId: string;
    name: string;
  }

  export interface AddressOrbit {
    semiMajorAxis: number;
    eccentricity: number;
    inclination: number;
    rightAscension: number;
    periapsis: number;
  }

  export type AddressLineType = 'SYSTEM' | 'STATION' | 'PLANET' | 'ORBIT';
}
