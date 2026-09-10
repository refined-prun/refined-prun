import { getStarNaturalId, starsStore } from '@src/infrastructure/prun-api/data/stars';
import { convertToPlanetNaturalId } from '@src/core/planet-natural-id';
import { exchangesStore } from '@src/infrastructure/prun-api/data/exchanges';
import { getSystemLineFromAddress } from '@src/infrastructure/prun-api/data/addresses';

const correctableCommands = new Set(['FLTS', 'INF', 'MS', 'SYSI']);

export function correctSystemCommand(parts: string[]) {
  if (!correctableCommands.has(parts[0].toUpperCase())) {
    return;
  }

  const args = parts.slice(1);
  const argsJoined = args.join(' ');
  let star = starsStore.getByName(argsJoined);

  if (!star) {
    const planetNaturalId = convertToPlanetNaturalId(argsJoined, args);
    star = starsStore.getByPlanetNaturalId(planetNaturalId);
  }

  if (!star) {
    const exchange = exchangesStore.getByNaturalId(argsJoined);
    const systemLine = getSystemLineFromAddress(exchange?.address);
    star = starsStore.getByNaturalId(systemLine?.entity.naturalId);
  }

  if (!star) {
    return;
  }

  const naturalId = getStarNaturalId(star);
  if (argsJoined !== naturalId) {
    parts.splice(1);
    parts.push(naturalId);
  }
}
