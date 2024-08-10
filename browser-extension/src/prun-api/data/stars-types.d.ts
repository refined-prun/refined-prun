declare module PrunApi {
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

  export interface Position {
    x: number;
    y: number;
    z: number;
  }

  declare type StarType = 'A' | 'B' | 'F' | 'G' | 'K' | 'M' | 'O';
}
