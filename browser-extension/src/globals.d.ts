type Arrayable<X> = X | X[];

interface SignalAsOptions {
  signal?: AbortSignal;
}

interface PrUnBuffer {
  frame: HTMLDivElement;
  command: string;
  parameter: string;
}

interface WindowMessage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
  context: string | undefined;
}
