type Arrayable<X> = X | X[];

interface SignalAsOptions {
  signal?: AbortSignal;
}

interface PrunTile {
  id: string;
  frame: HTMLDivElement;
  fullCommand: string;
  command: string;
  parameter: string | undefined;
  firstActivation: boolean;
}

declare type BaseTileState = Record<string, unknown>;
