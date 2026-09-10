import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { stationsStore } from '@src/infrastructure/prun-api/data/stations';
import { convertToPlanetNaturalId } from '@src/core/planet-natural-id';
import { getBaseStore } from '@src/core/store-id';

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
      if (command === 'INV') {
        redirectInvToBaseStore(parts, args[0]);
      }
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
    if (command === 'INV') {
      redirectInvToBaseStore(parts, naturalId);
    }
  }
}

// Native `INV <planet>` lists every store at the address (base, docked ships,
// warehouse) whenever more than one is present. Players open those other
// inventories through their own commands, so redirect straight to the base
// store here instead.
function redirectInvToBaseStore(parts: string[], naturalId: string) {
  const store = getBaseStore(naturalId);
  if (store === undefined) {
    return;
  }
  parts.splice(1);
  parts.push(store.id.substring(0, 8));
}
