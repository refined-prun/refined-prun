import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { getStarNaturalId, starsStore } from '@src/infrastructure/prun-api/data/stars';

// This function accepts anything that might be a planet name or natural id.
// For example, `Phobos`, `Hortus a`, `LoM pAlAnKa`, `wet water a`, `ot-580b`
// Pass in naturalIdOrName parts if you have them already to avoid re-splitting.
export function convertToPlanetNaturalId(naturalIdOrName: string, parts?: string[]) {
  const planet = planetsStore.find(naturalIdOrName);
  if (planet) {
    return planet.naturalId;
  }

  parts ??= naturalIdOrName.split(' ');
  return getPlanetNaturalIdByStarName(parts);
}

// For example, `Hortus a`: here `Hortus` is the system name and `a` is the planet letter.
// The return value in this case is `VH-331a` (`VH-331` is the system natural id of `Hortus`).
function getPlanetNaturalIdByStarName(parts: string[]) {
  if (parts.length < 2) {
    return undefined;
  }

  const systemName = parts.slice(0, -1).join(' ');
  const star = starsStore.find(systemName);
  if (star) {
    return getStarNaturalId(star) + parts[parts.length - 1];
  }

  return undefined;
}
