declare namespace PrunApi {
  export interface UIData {
    screens: Screen[];
    removedScreens: Screen[];
    tiles: Tile[];
    tileStates: UIState[];
    audioEnabled: boolean;
    helpEnabled: boolean;
    contextHelpEnabled: boolean;
  }

  export interface Screen {
    id: string;
    name: string;
    hidden: boolean;
    state: UIState[];
  }

  export interface UIState {
    containerId: string;
    key: string;
    value: string;
  }
}
