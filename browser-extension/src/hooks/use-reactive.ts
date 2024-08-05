import { useEffect, useMemo, useReducer, useRef } from 'preact/compat';
import { effect, stop } from '@vue/reactivity';

export default function useReactive<T>(fn: () => T): T {
  const value = useRef<T>();
  const forceUpdate = useForceUpdate();
  const runner = useMemo(
    () =>
      effect(() => {
        const newValue = fn();
        if (value.current !== newValue) {
          value.current = newValue;
          forceUpdate();
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => stop(runner), []);
  return value.current!;
}

function useForceUpdate(): () => void {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  return forceUpdate as () => void;
}
