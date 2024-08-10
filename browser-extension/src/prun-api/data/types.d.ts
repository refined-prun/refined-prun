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

  export type AddressLineType = 'SYSTEM' | 'STATION' | 'PLANET';

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
