import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { planetsStore } from '@src/infrastructure/prun-api/data/planets';

// Resolves a planet name from a base address, then the planet catalogue.
// Falls back to the original input.
export function getPlanetName(naturalIdOrName: string): string {
  const site = sitesStore.getByPlanetNaturalIdOrName(naturalIdOrName);
  const name = getEntityNameFromAddress(site?.address);
  return name ?? planetsStore.find(naturalIdOrName)?.name ?? naturalIdOrName;
}
