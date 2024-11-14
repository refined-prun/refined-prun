import { shipsStore } from '@src/infrastructure/prun-api/data/ships';

const correctableCommands = new Set(['SFC', 'SHP', 'SHPF', 'SHPI', 'SI']);

export function correctShipCommand(parts: string[]) {
  if (!correctableCommands.has(parts[0].toUpperCase())) {
    return;
  }

  const args = parts.slice(1);
  const shipName = args.join(' ');
  const ship = shipsStore.getByName(shipName);
  if (ship && shipName !== ship.registration) {
    parts.splice(1);
    parts.push(ship.registration);
  }
}
