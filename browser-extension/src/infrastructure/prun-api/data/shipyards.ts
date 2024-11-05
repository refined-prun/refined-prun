import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { request } from '@src/infrastructure/prun-api/data/request-hooks';
import { castArray } from '@src/utils/cast-array';
import { isEmpty } from 'ts-extras';

const store = createEntityStore<PrunApi.Shipyard>();
const state = store.state;

messages({
  DATA_DATA(data: { body: Arrayable<PrunApi.Shipyard>; path: string[] }) {
    if (isEmpty(data.path) || data.path[0] !== 'shipyards') {
      return;
    }
    store.setMany(castArray(data.body));
    store.setFetched();
  },
});

const getById = (id?: string | null) => {
  const result = state.getById(id);
  if (!result) {
    request.shipyards();
  }
  return result;
};

export const shipyardsStore = {
  ...state,
  getById,
};
