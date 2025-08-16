import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';
import { castArray } from '@src/utils/cast-array';
import { isEmpty } from 'ts-extras';
import { defaultStations } from '@src/infrastructure/prun-api/data/stations.default';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';

const store = createEntityStore<PrunApi.Station>(x => x.id, { preserveOnConnectionOpen: true });
const state = store.state;

onApiMessage({
  CLIENT_CONNECTION_OPENED() {
    store.setAll(defaultStations);
    store.setFetched();
  },
  DATA_DATA(data: { body: Arrayable<PrunApi.Station>; path: string[] }) {
    if (isEmpty(data.path) || data.path[0] !== 'stations') {
      return;
    }
    store.setMany(castArray(data.body));
  },
});

const getByNaturalId = createMapGetter(state.all, x => getEntityNaturalIdFromAddress(x.address)!);

const getByName = createMapGetter(state.all, x => x.name);

const getNaturalIdFromName = (name?: string | null) =>
  getEntityNaturalIdFromAddress(getByName(name)?.address);

export const stationsStore = {
  ...state,
  getByNaturalId,
  getByName,
  getNaturalIdFromName,
};
