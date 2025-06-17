declare namespace PrunApi {
  export interface Sector {
    id: string;
    name: string;
    hex: {
      q: number;
      r: number;
      s: number;
    };
    size: number;
    subsectors: Subsector[];
  }

  export interface Subsector {
    id: string;
    vertices: Position[];
  }
}
