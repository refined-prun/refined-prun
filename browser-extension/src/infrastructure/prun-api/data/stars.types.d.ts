declare namespace PrunApi {
  export interface Star {
    systemId: string;
    address: Address;
    name: string;
    type: StarType;
    position: Position;
    sectorId: string;
    subSectorId: string;
    connections: string[];
  }

  declare type StarType = 'A' | 'B' | 'F' | 'G' | 'K' | 'M' | 'O';
}
