declare namespace PrunApi {
  interface FXOrder {
    id: string;
    type: FXOrderType;
    initialAmount: CurrencyAmount;
    amount: CurrencyAmount;
    limit: FXOrderLimit;
    created: DateTime;
    status: FXOrderStatus;
    trades: FXTrade[];
  }

  interface FXOrderLimit {
    base: string;
    quote: string;
    rate: number;
    decimals: number;
  }

  type FXOrderStatus = 'PLACED' | 'PARTIALLY_FILLED' | 'FILLED';

  interface FXTrade {
    id: string;
    amount: CurrencyAmount;
    price: FXOrderLimit;
    time: DateTime;
    partner: ExchangeEntity;
  }

  type CXOrderType = 'BUYING' | 'SELLING';
}
