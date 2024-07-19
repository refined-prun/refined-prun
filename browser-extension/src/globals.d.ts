type Arrayable<X> = X | X[];

interface SignalAsOptions {
  signal?: AbortSignal;
}

interface PrunBuffer {
  frame: HTMLDivElement;
  command: string;
  parameter: string | undefined;
}
