declare namespace PrunApi {
  interface Star {
    systemId: string;
    address: Address;
    name: string;
    type: StarType;
    position: Position;
    sectorId: string;
    subSectorId: string;
    connections: string[];
  }

  type StarType = 'A' | 'B' | 'F' | 'G' | 'K' | 'M' | 'O';
}
