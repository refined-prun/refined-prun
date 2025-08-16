import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { getStarNaturalId, starsStore } from '@src/infrastructure/prun-api/data/stars';
import { stationsStore } from '@src/infrastructure/prun-api/data/stations';

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

const stationCommands = new Set(['INV', 'LM', 'LMP', 'WAR']);

export function correctPlanetCommand(parts: string[]) {
  const command = parts[0].toUpperCase();
  if (!correctableCommands.has(command)) {
    return;
  }

  const args = parts.slice(1);
  if (args.length === 1) {
    // For example, `LM VH-331a`
    if (planetsStore.getByNaturalId(args[0])) {
      return;
    }
    // For example, `LM HRT`
    if (stationCommands.has(command) && stationsStore.getByNaturalId(args[0])) {
      return;
    }
  }

  const naturalId = correctByPlanetName(args) ?? correctByStarName(args);
  if (naturalId) {
    parts.splice(1);
    parts.push(naturalId);
  }
}

// For example, `LM Promitor`
function correctByPlanetName(args: string[]) {
  const planetName = args.join(' ');
  const planet = planetsStore.find(planetName);
  return planet && planetName !== planet.naturalId ? planet.naturalId : undefined;
}

// For example, `LM Hortus a`
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
