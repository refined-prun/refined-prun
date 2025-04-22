declare namespace PrunApi {
  interface Store {
    id: string;
    addressableId: string;
    name: null | string;
    weightLoad: number;
    weightCapacity: number;
    volumeLoad: number;
    volumeCapacity: number;
    items: StoreItem[];
    fixed: boolean;
    tradeStore: boolean;
    rank: number;
    locked: boolean;
    type: StoreType;
  }

  interface StoreItem {
    quantity?: MaterialAmountValue | null;
    id: string;
    type: 'INVENTORY' | 'SHIPMENT';
    weight: number;
    volume: number;
  }

  type StoreType = 'STORE' | 'WAREHOUSE_STORE' | 'SHIP_STORE' | 'STL_FUEL_STORE' | 'FTL_FUEL_STORE';
}
