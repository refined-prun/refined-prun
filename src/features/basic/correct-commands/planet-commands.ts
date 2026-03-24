import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { stationsStore } from '@src/infrastructure/prun-api/data/stations';
import { convertToPlanetNaturalId } from '@src/core/planet-natural-id';

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

  const joinedArgs = args.join(' ');
  const naturalId = convertToPlanetNaturalId(joinedArgs, args);
  if (naturalId && joinedArgs !== naturalId) {
    parts.splice(1);
    parts.push(naturalId);
  }
}
