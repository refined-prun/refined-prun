declare namespace PrunApi {
  export interface CurrencyAccount {
    category: string;
    type: number;
    number: number;
    bookBalance: CurrencyAmount;
    currencyBalance: CurrencyAmount;
  }
}
