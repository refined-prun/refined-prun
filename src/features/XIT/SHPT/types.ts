export interface ShipmentItem {
  id: string;
  weight: number;
  volume: number;
  destination: string;
  contractId: string;
}

export interface ContractSubgroup {
  contractId: string;
  items: ShipmentItem[];
  totalWeight: number;
  totalVolume: number;
}

export interface ShipmentGroupData {
  destination: string;
  contracts: ContractSubgroup[];
  totalWeight: number;
  totalVolume: number;
  totalItems: number;
}
