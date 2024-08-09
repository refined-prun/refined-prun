import { useLayoutEffect, useMemo, useRef } from 'preact/compat';
import { State, store } from '@src/prun-api/data/store';
import useForceUpdate from '@src/hooks/use-force-update';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function usePrunSelector<T, Args extends any[]>(
  selector: (state: State, ...args: Args) => T,
  ...args: Args
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoSelector = useMemo(() => (s: State) => selector(s, ...args), [selector, ...args]);
  const lastSelector = useRef<((state: State) => T) | undefined>(undefined);
  const selected = useRef<T | undefined>(undefined);
  const forceUpdate = useForceUpdate();

  if (lastSelector.current !== memoSelector) {
    selected.current = memoSelector(store.getState());
    lastSelector.current = memoSelector;
  }

  useLayoutEffect(() => {
    function checkForUpdates() {
      const newSelected = memoSelector(store.getState());
      if (selected.current !== newSelected) {
        selected.current = newSelected;
        forceUpdate();
      }
    }

    return store.subscribe(checkForUpdates);
  }, [forceUpdate, memoSelector]);

  return selected.current as T;
}
