type Arrayable<X> = X | X[];

interface SignalAsOptions {
  signal?: AbortSignal;
}

interface PrUnBuffer {
  frame: HTMLDivElement;
  command: string;
  parameter: string;
}
