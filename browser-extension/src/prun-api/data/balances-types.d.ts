declare namespace PrunApi {
  export interface CurrencyAccount {
    category: string;
    type: number;
    number: number;
    bookBalance: CurrencyAmount;
    currencyBalance: CurrencyAmount;
  }

  export interface BookingItem {
    period: number;
    number: number;
    item: number;
    accountCategory: AccountCategory;
    accountType: number;
    account: number;
    debit: boolean;
    type: string;
    bookAmount: CurrencyAmount;
    amount: CurrencyAmount;
    bookBalance: CurrencyAmount;
    balance: CurrencyAmount;
    time: DateTime;
    cash: boolean;
  }

  declare type AccountCategory = 'LIQUID_ASSETS' | string;
}
