type Arrayable<X> = X | X[];

interface SignalAsOptions {
  signal?: AbortSignal;
}
