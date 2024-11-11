declare namespace PrunApi {
  export interface FXOrder {
    id: string;
    type: FXOrderType;
    initialAmount: CurrencyAmount;
    amount: CurrencyAmount;
    limit: FXOrderLimit;
    created: DateTime;
    status: FXOrderStatus;
    trades: FXTrade[];
  }

  export interface FXOrderLimit {
    base: string;
    quote: string;
    rate: number;
    decimals: number;
  }

  declare type FXOrderStatus = 'PLACED' | 'PARTIALLY_FILLED' | 'FILLED';

  export interface FXTrade {
    id: string;
    amount: CurrencyAmount;
    price: FXOrderLimit;
    time: DateTime;
    partner: ExchangeEntity;
  }

  declare type CXOrderType = 'BUYING' | 'SELLING';
}
