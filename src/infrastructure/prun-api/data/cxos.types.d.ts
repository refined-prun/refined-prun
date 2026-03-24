declare namespace PrunApi {
  interface CXOrder {
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

  type CXOrderStatus = 'PLACED' | 'PARTIALLY_FILLED' | 'FILLED';

  interface CXTrade {
    id: string;
    amount: number;
    price: CurrencyAmount;
    time: DateTime;
    partner: ExchangeEntity;
  }

  type CXOrderType = 'BUYING' | 'SELLING';
}
