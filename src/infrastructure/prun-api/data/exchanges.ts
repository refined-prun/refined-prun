import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';
import { castArray } from '@src/utils/cast-array';
import { isEmpty } from 'ts-extras';
import { defaultExchanges } from '@src/infrastructure/prun-api/data/exchanges.default';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';

const store = createEntityStore<PrunApi.Exchange>({ preserveOnConnectionOpen: true });
const state = store.state;

onApiMessage({
  CLIENT_CONNECTION_OPENED() {
    store.setAll(defaultExchanges);
    store.setFetched();
  },
  DATA_DATA(data: { body: Arrayable<PrunApi.Exchange>; path: string[] }) {
    if (isEmpty(data.path) || data.path[0] !== 'commodityexchanges') {
      return;
    }
    store.setMany(castArray(data.body));
  },
});

const getByNaturalId = createMapGetter(state.all, x => getEntityNaturalIdFromAddress(x.address)!);

const getByCode = createMapGetter(state.all, x => x.code);

const getByName = createMapGetter(state.all, x => x.name);

const getNaturalIdFromCode = (code?: string | null) =>
  getEntityNaturalIdFromAddress(getByCode(code)?.address);

export const exchangesStore = {
  ...state,
  getByNaturalId,
  getByCode,
  getByName,
  getNaturalIdFromCode,
};
