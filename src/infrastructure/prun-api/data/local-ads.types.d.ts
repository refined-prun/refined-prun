declare namespace PrunApi {
  interface LocalAd {
    origin?: Address;
    destination?: Address;
    cargoWeight?: number;
    cargoVolume?: number;
    localMarketId: string;
    naturalId: number;
    status: string;
    // This is not ExchangeOperator, but oh well
    creator: ExchangeOperator;
    type: LocalAdType;
    address: Address;
    quantity: MaterialAmount | null;
    price: CurrencyAmount;
    advice: number;
    creationTime: DateTime;
    minimumRating: string;
    expiry: DateTime;
    id: string;
  }

  type LocalAdType = 'COMMODITY_BUYING' | 'COMMODITY_SELLING' | 'COMMODITY_SHIPPING';
}
