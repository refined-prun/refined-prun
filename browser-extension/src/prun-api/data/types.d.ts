declare module PrunApi {
  export interface Address {
    lines: AddressLine[];
  }

  export interface AddressLine {
    entity: AddressEntity;
    type: AddressLineType;
  }

  export interface AddressEntity {
    id: string;
    naturalId: string;
    name: string;
  }

  export enum AddressLineType {
    system = 'SYSTEM',
    station = 'STATION',
    planet = 'PLANET',
  }

  export interface DateTime {
    timestamp: number;
  }

  export interface TimeSpan {
    millis: number;
  }

  export interface CurrencyAmount {
    currency: string;
    amount: number;
  }
}
