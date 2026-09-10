export function useTile() {
  return inject(tileKey)!;
}

export const tileKey = Symbol() as InjectionKey<PrunTile>;
