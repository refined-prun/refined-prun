declare namespace PrunApi {
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

  export interface Position {
    x: number;
    y: number;
    z: number;
  }
}
