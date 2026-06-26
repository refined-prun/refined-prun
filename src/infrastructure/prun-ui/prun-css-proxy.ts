// Wraps the parsed CSS class tree so that walking a missing path never throws. `C` is always two
// levels deep (`C.Namespace.className`); the top level keeps tracking the path without reporting,
// and the namespace level is the terminal: an existing class resolves to its real string, while a
// missing one logs an error and returns `undefined`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createCssProxy(node: Record<string, any> | undefined, path: string) {
  return new Proxy(
    {},
    {
      get(_target, key) {
        if (typeof key === 'symbol') {
          return undefined;
        }
        return createCssNamespaceProxy(node?.[key], `${path}.${key}`);
      },
      ownKeys() {
        return Reflect.ownKeys(node ?? {});
      },
      getOwnPropertyDescriptor(_target, key) {
        if (!node || !(key in node)) {
          return undefined;
        }
        return { value: node[key as string], enumerable: true, configurable: true, writable: true };
      },
      has(_target, key) {
        return node ? key in node : false;
      },
    },
  );
}

function createCssNamespaceProxy(namespace: Record<string, string> | undefined, path: string) {
  return new Proxy(
    {},
    {
      get(_target, key) {
        if (typeof key === 'symbol') {
          return undefined;
        }
        const className = namespace?.[key];
        if (className === undefined) {
          reportMissingCssClass(`${path}.${key}`);
          return undefined;
        }
        return className;
      },
      ownKeys() {
        return Reflect.ownKeys(namespace ?? {});
      },
      getOwnPropertyDescriptor(_target, key) {
        if (!namespace || !(key in namespace)) {
          return undefined;
        }
        return {
          value: namespace[key as string],
          enumerable: true,
          configurable: true,
          writable: true,
        };
      },
      has(_target, key) {
        return namespace ? key in namespace : false;
      },
    },
  );
}

function reportMissingCssClass(path: string) {
  console.error(`Missing CSS class: ${path}`);
}
