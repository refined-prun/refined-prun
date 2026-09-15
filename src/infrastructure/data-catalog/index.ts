import { DataCatalog } from '@src/core/data-query/catalog';
import { gameDataSources } from '@src/infrastructure/data-catalog/game-sources';
import { tileDataSources } from '@src/infrastructure/data-catalog/tile-sources';

export const dataCatalog = new DataCatalog([...gameDataSources, ...tileDataSources]);

export * from '@src/core/data-query/types';
export { DataQueryError, parseFilterValue } from '@src/core/data-query/query';
