import { useEffect, useReducer } from 'preact/compat';
import { State, store } from '@src/prun-api/data/store';

export default function usePrunData<T>(selector: (state: State) => T): T {
  const [state, dispatch] = useReducer<T, State>((_: T, state: State) => selector(state), selector(store.getState()));
  useEffect(() => {
    return store.subscribe(() => dispatch(store.getState()));
  }, []);
  return state;
}
