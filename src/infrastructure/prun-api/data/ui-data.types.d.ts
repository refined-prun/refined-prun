declare namespace PrunApi {
  interface UIData {
    screens: Screen[];
    removedScreens: Screen[];
    tiles: Tile[];
    tileStates: UIState[];
    audioEnabled: boolean;
    helpEnabled: boolean;
    contextHelpEnabled: boolean;
  }

  interface Screen {
    id: string;
    name: string;
    hidden: boolean;
    state: UIState[];
  }

  interface UIState {
    containerId: string;
    key: string;
    value: string;
  }
}
