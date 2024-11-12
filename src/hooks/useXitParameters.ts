export function useXitParameters() {
  return inject(xit.parameters) ?? [];
}
