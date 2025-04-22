declare namespace PrunApi {
  interface DateTime {
    timestamp: number;
  }

  interface TimeSpan {
    millis: number;
  }

  interface CurrencyAmount {
    currency: string;
    amount: number;
  }

  interface Position {
    x: number;
    y: number;
    z: number;
  }

  interface Currency {
    numericCode: number;
    code: string;
    name: string;
    decimals: number;
  }

  interface ExchangeEntity {
    id: string;
    name: string;
    code: string;
  }
}
