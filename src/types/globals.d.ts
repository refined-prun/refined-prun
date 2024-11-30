interface PrunTile {
  id: string;
  frame: HTMLDivElement;
  anchor: HTMLDivElement;
  docked: boolean;
  fullCommand: string;
  command: string;
  parameter: string | undefined;
}
