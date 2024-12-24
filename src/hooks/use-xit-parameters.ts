export function useXitParameters() {
  return inject(xitParametersKey) ?? [];
}

export const xitParametersKey = Symbol() as InjectionKey<string[]>;
