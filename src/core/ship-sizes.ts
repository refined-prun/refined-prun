export interface ShipSize {
  // Stable key persisted in userData.settings.burn.planetPickup.
  id: string;
  label: string;
  weight: number;
  volume: number;
}

// Cargo hold sizes of the common freighter configurations.
export const shipSizes: ShipSize[] = [
  { id: '500/500', label: '500t / 500m³', weight: 500, volume: 500 },
  { id: '1k/3k', label: '1kt / 3km³', weight: 1000, volume: 3000 },
  { id: '2k/2k', label: '2kt / 2km³', weight: 2000, volume: 2000 },
  { id: '3k/1k', label: '3kt / 1km³', weight: 3000, volume: 1000 },
  { id: '5k/5k', label: '5kt / 5km³', weight: 5000, volume: 5000 },
];

export function getShipSize(id: string | undefined) {
  if (id === undefined) {
    return undefined;
  }
  return shipSizes.find(x => x.id === id);
}
