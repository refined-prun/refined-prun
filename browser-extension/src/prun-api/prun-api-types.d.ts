declare module PrunApi {
  declare module WORLD_MATERIAL_CATEGORIES {
    export interface Payload {
      categories: MaterialCategory[];
    }

    export interface MaterialCategory {
      name: string;
      id: string;
      materials: Material[];
    }

    export interface Material {
      name: string;
      id: string;
      ticker: string;
      category: string;
      weight: number;
      volume: number;
      resource: boolean;
    }
  }

  declare module SYSTEM_STARS_DATA {
    export interface Payload {
      stars: Star[];
    }

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

    export interface Address {
      lines: Line[];
    }

    export interface Line {
      entity: Entity;
      type: LineType;
    }

    export interface Entity {
      id: string;
      naturalId: string;
      name: string;
    }

    export type LineType = 'SYSTEM' | 'PLANET';

    export interface Position {
      x: number;
      y: number;
      z: number;
    }

    export type StarType = 'A' | 'B' | 'F' | 'G' | 'K' | 'M' | 'O';
  }
}
