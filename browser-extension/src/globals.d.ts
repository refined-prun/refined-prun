interface PrunTile {
  id: string;
  frame: HTMLDivElement;
  fullCommand: string;
  command: string;
  parameter: string | undefined;
  firstActivation: boolean;
}
