declare module PrunApi {
  export interface Store {
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
    type: string;
  }

  export interface StoreItem {
    quantity: MaterialAmountWithValue;
    id: string;
    type: string;
    weight: number;
    volume: number;
  }
}
