interface PrunTile {
  id: string;
  container: HTMLElement;
  frame: HTMLDivElement;
  anchor: HTMLDivElement;
  docked: boolean;
  fullCommand: string;
  command: string;
  parameter: string | undefined;
}
