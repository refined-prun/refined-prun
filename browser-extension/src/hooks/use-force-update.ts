import { useReducer } from 'preact/compat';

export default function useForceUpdate(): () => void {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  return forceUpdate as () => void;
}
