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

export const shipStatusI18nIconReplacements = [
  {
    key: 'ships.status.stationary',
    icon: stationaryShipStatusIcon,
  },
  {
    key: 'ShipStatus.takeoff',
    icon: shipStatusIconBySegmentType.TAKE_OFF,
  },
  {
    key: 'ShipStatus.departure',
    icon: shipStatusIconBySegmentType.DEPARTURE,
  },
  {
    key: 'ShipStatus.transit',
    icon: shipStatusIconBySegmentType.TRANSIT,
  },
  {
    key: 'ShipStatus.charge',
    icon: shipStatusIconBySegmentType.CHARGE,
  },
  {
    key: 'ShipStatus.jump',
    icon: shipStatusIconBySegmentType.JUMP,
  },
  {
    key: 'ShipStatus.float',
    icon: shipStatusIconBySegmentType.FLOAT,
  },
  {
    key: 'ShipStatus.approach',
    icon: shipStatusIconBySegmentType.APPROACH,
  },
  {
    key: 'ShipStatus.landing',
    icon: shipStatusIconBySegmentType.LANDING,
  },
  {
    key: 'ShipStatus.lock',
    icon: shipStatusIconBySegmentType.LOCK,
  },
  {
    key: 'ShipStatus.decay',
    icon: shipStatusIconBySegmentType.DECAY,
  },
  {
    key: 'ShipStatus.jumpgateway',
    icon: shipStatusIconBySegmentType.JUMP_GATEWAY,
  },
] as const;

export function getShipStatusIcon(segmentType: string) {
  return shipStatusIconBySegmentType[segmentType] ?? '?';
}
