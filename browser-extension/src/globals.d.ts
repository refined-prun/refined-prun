type Arrayable<X> = X | X[];

interface SignalAsOptions {
  signal?: AbortSignal;
}

interface PrunTile {
  frame: HTMLDivElement;
  fullCommand: string;
  command: string;
  parameter: string | undefined;
  firstActivation: boolean;
}
