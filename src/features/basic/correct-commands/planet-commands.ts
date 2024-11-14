import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { getStarNaturalId, starsStore } from '@src/infrastructure/prun-api/data/stars';

const correctableCommands = new Set([
  'ADM',
  'BBC',
  'BRA',
  'BS',
  'BSC',
  'COGC',
  'COGCPEX',
  'COGCU',
  'FLTP',
  'GOV',
  'INV',
  'LM',
  'LMP',
  'LR',
  'PLI',
  'POPI',
  'POPR',
  'PPS',
  'SHY',
  'WAR',
]);

export function correctPlanetCommand(parts: string[]) {
  if (!correctableCommands.has(parts[0].toUpperCase())) {
    return;
  }

  const args = parts.slice(1);
  const naturalId = correctByPlanetName(args) ?? correctByStarName(args);
  if (naturalId) {
    parts.splice(1);
    parts.push(naturalId);
  }
}

function correctByPlanetName(args: string[]) {
  const planetName = args.join(' ');
  const planet = planetsStore.find(planetName);
  return planet && planetName !== planet.naturalId ? planet.naturalId : undefined;
}

function correctByStarName(args: string[]) {
  if (args.length < 2) {
    return undefined;
  }
  const systemName = args.slice(0, -1).join(' ');
  const star = starsStore.getByName(systemName);
  if (!star) {
    return undefined;
  }
  return getStarNaturalId(star) + args[args.length - 1];
}
