/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionReducerMapBuilder, createSlice, Draft, EntityAdapter, EntityId, EntityState } from '@reduxjs/toolkit';

type CaseReducer<T> = (state: Draft<T>, data: any) => NoInfer<T> | void | Draft<NoInfer<T>>;

type Cases<T> = { [type: string]: CaseReducer<T> };

export function caseReducers<T>(builder: ActionReducerMapBuilder<T>, cases: Cases<T>) {
  for (const type of Object.keys(cases)) {
    const reducer = cases[type];
    builder.addCase(type, (state, action: any) => reducer(state, action.data));
  }
}

type FetchingEntityState<T, Id extends EntityId> = EntityState<T, Id> & { fetched: boolean };

export function createEntitySlice<T>(adapter: EntityAdapter<T, string>, cases: Cases<FetchingEntityState<T, string>>) {
  return createSlice({
    name: 'entity-slice',
    initialState: {
      ...adapter.getInitialState(),
      fetched: false,
    } as FetchingEntityState<T, string>,
    reducers: {},
    extraReducers: builder => caseReducers(builder, cases),
  });
}
