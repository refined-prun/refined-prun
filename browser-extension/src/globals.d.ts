type Arrayable<X> = X | X[];

interface SignalAsOptions {
  signal?: AbortSignal;
}

interface PrunBuffer {
  frame: HTMLDivElement;
  fullCommand: string;
  command: string;
  parameter: string | undefined;
}
