export const stationaryShipStatusIcon = '⦁';

export const shipStatusIconBySegmentType: Record<string, string> = {
  TAKE_OFF: '↑',
  DEPARTURE: '↗',
  TRANSIT: '⟶',
  CHARGE: '±',
  JUMP: '➾',
  FLOAT: '↑',
  APPROACH: '↘',
  LANDING: '↓',
  LOCK: '⟴',
  DECAY: '⟴',
  JUMP_GATEWAY: '⟴',
};

export function getShipStatusIcon(segmentType: string) {
  return shipStatusIconBySegmentType[segmentType] ?? '?';
}
