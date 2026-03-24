declare namespace PrunApi {
  interface CXBrokerPrices {
    brokerId: string;
    from: DateTime;
    prices: CXIntervalPrices[];
  }

  interface CXIntervalPrices {
    interval: string;
    prices: CXPriceCandle[];
  }

  interface CXPriceCandle {
    date: number;
    open: number;
    close: number;
    high: number;
    low: number;
    volume: number;
    traded: number;
  }
}
