declare namespace PrunApi {
  interface Address {
    lines: AddressLine[];
  }

  interface AddressLine {
    entity: AddressEntity;
    type: AddressLineType;
    orbit?: AddressOrbit;
  }

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

  type AddressLineType = 'SYSTEM' | 'STATION' | 'PLANET' | 'ORBIT';
}
