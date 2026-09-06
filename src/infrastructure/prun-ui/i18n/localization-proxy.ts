// An empty callable target, so the `apply` trap fires when a node is invoked as `L.x.y()`.
const localizationProxyTarget = () => undefined;

// Wraps the localization tree so that walking a missing path never throws. Property access keeps
// tracking the path; the result only resolves at a terminal op - `()`, `getFormat()`, `toString()`
// or `valueOf()` - yielding the real value when the path exists and `undefined` (plus an error log)
// when it does not.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createLocalizationProxy(node: any, path: string) {
  return new Proxy(localizationProxyTarget, {
    get(_target, key) {
      if (key === 'getFormat') {
        return () => {
          if (typeof node?.getFormat === 'function') {
            return node.getFormat();
          }
          reportMissingLocalization(path);
          return undefined;
        };
      }
      if (key === 'toString' || key === 'valueOf' || key === Symbol.toPrimitive) {
        return () => {
          if (typeof node === 'function') {
            return node();
          }
          reportMissingLocalization(path);
          return undefined;
        };
      }
      if (typeof key === 'symbol') {
        return undefined;
      }
      return createLocalizationProxy(node ? node[key] : undefined, `${path}.${key}`);
    },
    apply(_target, _thisArg, args) {
      if (typeof node === 'function') {
        return node(...args);
      }
      reportMissingLocalization(path);
      return undefined;
    },
  });
}

function reportMissingLocalization(path: string) {
  console.error(`Missing localization entry: ${path}`);
}
