import { createEntityStore } from '@src/prun-api/data/create-entity-store';
import { messages } from '@src/prun-api/data/api-messages';
import { request } from '@src/prun-api/data/request-hooks';
import { castArray } from '@src/utils/cast-array';

const store = createEntityStore<PrunApi.Shipyard>();
const state = store.state;

messages({
  DATA_DATA(data: { body: Arrayable<PrunApi.Shipyard>; path: string[] }) {
    if (data.path.length === 0 || data.path[0] !== 'shipyards') {
      return;
    }
    store.setMany(castArray(data.body));
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