declare namespace PrunApi {
  interface Exchange {
    name: string;
    code: string;
    operator: ExchangeOperator;
    currency: Currency;
    address: Address;
    id: string;
  }

  interface ExchangeOperator {
    id: string;
    code: string;
    name: string;
  }
}
