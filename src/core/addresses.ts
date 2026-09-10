import {
  getFullAddressName,
  getLocationLineFromAddress,
  getSystemLineFromAddress,
  isStationLine,
} from '@src/infrastructure/prun-api/data/addresses';

export function getDestinationInfo(address?: PrunApi.Address) {
  if (!address) {
    return undefined;
  }

  const gateway = address.lines.find(x => x.type === 'GATEWAY')?.entity;
  if (gateway) {
    return {
      name: gateway.name,
      command: `GTW ${gateway.naturalId}`,
    };
  }

  const location = getLocationLineFromAddress(address);
  const name = getFullAddressName(address);
  if (!name) {
    return undefined;
  }

  if (location) {
    return {
      name,
      command: `${isStationLine(location) ? 'STNS' : 'PLI'} ${location.entity.naturalId}`,
    };
  }

  const system = getSystemLineFromAddress(address);
  if (system) {
    return {
      name,
      command: `MS ${system.entity.naturalId}`,
    };
  }

  return undefined;
}
