export function useXitCommand() {
  return inject(xitCommandKey) ?? '';
}

export const xitCommandKey = Symbol() as InjectionKey<string>;
