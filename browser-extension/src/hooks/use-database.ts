import { useEffect, useReducer } from 'preact/compat';
import database, { State } from '@src/store/database/database';

export default function useDatabase<T>(selector: (state: State) => T): T {
  const [state, dispatch] = useReducer<T, State>(
    (_: T, state: State) => selector(state),
    selector(database.getState()),
  );
  useEffect(() => {
    database.subscribe(dispatch);
    return () => database.unsubscribe(dispatch);
  }, []);
  return state;
}
