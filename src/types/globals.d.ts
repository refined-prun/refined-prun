interface PrunTile {
  id: string;
  container: HTMLElement;
  frame: HTMLDivElement;
  anchor: HTMLDivElement;
  window: HTMLElement | null;
  docked: boolean;
  fullCommand: string;
  command: string;
  parameter: string | undefined;
}
