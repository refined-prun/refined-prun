declare namespace PrunApi {
  interface Warehouse {
    warehouseId: string;
    storeId: string;
    units: number;
    weightCapacity: number;
    volumeCapacity: number;
    nextPayment: DateTime;
    fee: CurrencyAmount;
    feeCollector: FeeCollector;
    status: string;
    address: Address;
  }

  interface FeeCollector {
    currency?: Currency;
    id?: string;
    code?: string;
    name?: string;
  }
}
