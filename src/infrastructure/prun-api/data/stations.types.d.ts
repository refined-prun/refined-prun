declare namespace PrunApi {
  interface Station {
    naturalId: string;
    name: string;
    address: Address;
    commissioningTime: DateTime;
    comex: Comex;
    warehouseId: string;
    localMarketId: string;
    country: Comex;
    currency: Currency;
    governingEntity: Comex;
    id: string;
  }
}
