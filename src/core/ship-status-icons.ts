export const stationaryShipStatusIcon = '\u2981';

export const shipStatusIconBySegmentType: Record<string, string> = {
  TAKE_OFF: '\u2191',
  DEPARTURE: '\u2197',
  TRANSIT: '\u27f6',
  CHARGE: '\u00b1',
  JUMP: '\u27be',
  FLOAT: '\u2191',
  APPROACH: '\u2198',
  LANDING: '\u2193',
  LOCK: '\u27f4',
  DECAY: '\u27f4',
  JUMP_GATEWAY: '\u27f4',
};

export function getShipStatusIcon(segmentType: string) {
  return shipStatusIconBySegmentType[segmentType] ?? '?';
}
