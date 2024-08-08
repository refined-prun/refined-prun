declare module PrunApi {
  export interface CXOrder {
    id: string;
    exchange: ExchangeEntity;
    brokerId: string;
    type: CXOrderType;
    material: Material;
    amount: number;
    initialAmount: number;
    limit: CurrencyAmount;
    status: CXOrderStatus;
    created: DateTime;
    trades: CXTrade[];
  }

  declare type CXOrderStatus = 'PLACED' | 'PARTIALLY_FILLED' | 'FILLED';

  export interface CXTrade {
    id: string;
    amount: number;
    price: CurrencyAmount;
    time: DateTime;
    partner: ExchangeEntity;
  }

  declare type CXOrderType = 'BUYING' | 'SELLING';
}
