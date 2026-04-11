import { createTileStateHook } from '@src/store/user-data-tiles';
import { MatioPricing } from '@src/features/XIT/MATIO/utils';

export const useTileState = createTileStateHook({
  mode: 'all' as 'all' | 'production' | 'workforce',
  pricingByPlanet: {} as Record<string, MatioPricing>,
  expand: [] as string[],
});
