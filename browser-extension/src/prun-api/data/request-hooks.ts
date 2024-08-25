/* eslint-disable @typescript-eslint/no-unused-vars */

export const request = {
  production(siteId?: string | null): void {
    throw Error('Not implemented');
  },
  workforce(siteId?: string | null): void {
    throw Error('Not implemented');
  },
  cxos(): void {
    throw Error('Not implemented');
  },
  fxos(): void {
    throw Error('Not implemented');
  },
};

export function createRequestGetter<T, K>(
  getter: (value?: K | null) => T | undefined,
  request: (value?: K | null) => void,
) {
  return (value?: K | null) => {
    const result = getter(value);
    if (result) {
      return result;
    }
    request(value);
    return undefined;
  };
}
