declare namespace PrunApi {
  interface Tile {
    id: string;
    parentId: null | string;
    content: null | string;
    container: TileContainer | null;
  }

  interface TileContainer {
    child1Id: string;
    child2Id: string;
    dividerPosition: number;
    vertical: boolean;
  }
}
