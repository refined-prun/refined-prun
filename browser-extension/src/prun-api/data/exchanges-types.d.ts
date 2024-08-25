declare namespace PrunApi {
  export interface Exchange {
    name: string;
    code: string;
    operator: ExchangeOperator;
    currency: Currency;
    address: Address;
    id: string;
  }

  export interface ExchangeOperator {
    id: string;
    code: string;
    name: string;
  }
}
