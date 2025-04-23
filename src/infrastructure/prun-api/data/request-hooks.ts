interface RequestHooks {
  production(siteId?: string | null): void;

  workforce(siteId?: string | null): void;

  cxos(): void;

  fxos(): void;

  blueprints(): void;

  shipyards(): void;

  shipyardProjects(): void;
}

let hooks: RequestHooks | undefined = undefined;

export function implementRequestHooks(newHooks: RequestHooks) {
  hooks = newHooks;
}

export const request = {
  production(siteId?: string | null): void {
    getHooks().production(siteId);
  },
  workforce(siteId?: string | null): void {
    getHooks().workforce(siteId);
  },
  cxos(): void {
    getHooks().cxos();
  },
  fxos(): void {
    getHooks().fxos();
  },
  blueprints(): void {
    getHooks().blueprints();
  },
  shipyards(): void {
    getHooks().shipyards();
  },
  shipyardProjects(): void {
    getHooks().shipyardProjects();
  },
};

function getHooks() {
  if (!hooks) {
    throw Error('Not implemented');
  }
  return hooks;
}

export function createRequestGetter<T, K>(
  getter: (value?: K | null) => T | undefined,
  request: (value?: K | null) => void,
) {
  return (value?: K | null) => {
    const result = getter(value);
    if (result !== undefined) {
      return result;
    }
    request(value);
    return undefined;
  };
}

type RequestStore<T> = T & { request(): void };

export function createRequestStore<T>(request: () => void, store: T): RequestStore<T> {
  const wrapped = {} as RequestStore<T>;
  for (const key in store) {
    Object.defineProperty(wrapped, key, {
      get: () => {
        request();
        return store[key];
      },
    });
  }
  wrapped.request = request;
  return wrapped;
}
