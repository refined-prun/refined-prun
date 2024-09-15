declare namespace PrunApi {
  export interface Warehouse {
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

  export interface FeeCollector {
    currency?: Currency;
    id?: string;
    code?: string;
    name?: string;
  }
}
