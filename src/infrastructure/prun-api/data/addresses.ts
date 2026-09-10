import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';

type State = Record<string, PrunApi.Address | null | undefined>;

const state = shallowReactive<State>({});

onApiMessage({
  CLIENT_CONNECTION_OPENED() {
    for (const id of Object.keys(state)) {
      delete state[id];
    }
  },
  ADDRESS_ADDRESSABLE_MAPPING(data: {
    mappings: { addressableId: string; address: PrunApi.Address | null }[];
  }) {
    for (const mapping of data.mappings) {
      state[mapping.addressableId] = mapping.address;
    }
  },
  SHIP_SHIPS(data: { ships: PrunApi.Ship[] }) {
    for (const ship of data.ships) {
      state[ship.id] = ship.address;
    }
  },
  SHIP_DATA(data: PrunApi.Ship) {
    state[data.id] = data.address;
  },
  SHIP_FLIGHT_FLIGHT(data: PrunApi.Flight) {
    state[data.shipId] = null;
  },
  SHIP_FLIGHT_FLIGHT_ENDED(data: PrunApi.Flight) {
    state[data.shipId] = data.destination;
  },
  SITE_SITES(data: { sites: PrunApi.Site[] }) {
    for (const storage of data.sites) {
      state[storage.siteId] = storage.address;
    }
  },
  SITE_SITE(data: PrunApi.Site) {
    state[data.siteId] = data.address;
  },
  WAREHOUSE_STORAGES(data: { storages: PrunApi.Warehouse[] }) {
    for (const storage of data.storages) {
      state[storage.warehouseId] = storage.address;
    }
  },
  WAREHOUSE_STORAGE(data: PrunApi.Warehouse) {
    state[data.warehouseId] = data.address;
  },
  DATA_DATA(data: { path: string[]; body: { id: string; address: PrunApi.Address } }) {
    if (data.path.length === 2 && data.path[0] === 'warehouses') {
      state[data.body.id] = data.body.address;
    }
  },
  ASSETS_ASSETS(data: { assets: { infrastructureId: string; address: PrunApi.Address }[] }) {
    for (const asset of data.assets) {
      state[asset.infrastructureId] = asset.address;
    }
  },
});

export const addressesStore = state;

export const getEntityNaturalIdFromAddress = (address?: PrunApi.Address | null) => {
  return getLocationLineFromAddress(address)?.entity.naturalId;
};

export const getEntityNameFromAddress = (address?: PrunApi.Address | null) => {
  const location = getLocationLineFromAddress(address);
  if (!location) {
    return undefined;
  }

  if (!isPlanetLine(location) || location.entity.name !== location.entity.naturalId) {
    return location.entity.name;
  }

  const system = getSystemLineFromAddress(address);
  if (!system || system.entity.name === system.entity.naturalId) {
    return location.entity.name;
  }

  return location.entity.name.replace(system.entity.naturalId, `${system.entity.name} `);
};

export const getSystemLineFromAddress = (address?: PrunApi.Address | null) => {
  if (!address) {
    return undefined;
  }
  return isSystemLine(address.lines[0]) ? address.lines[0] : address.lines.find(isSystemLine);
};

export const getLocationLineFromAddress = (address?: PrunApi.Address | null) => {
  if (!address) {
    return undefined;
  }
  return isLocationLine(address.lines[1]) ? address.lines[1] : address.lines.find(isLocationLine);
};

export function getAddressName(destination?: PrunApi.Address) {
  if (!destination) {
    return undefined;
  }

  const location = getLocationLineFromAddress(destination);
  if (isStationLine(location)) {
    return location.entity.naturalId;
  }

  return getEntityNameFromAddress(destination);
}

export function getFullAddressName(destination?: PrunApi.Address) {
  if (!destination) {
    return undefined;
  }

  const location = getLocationLineFromAddress(destination);
  if (isStationLine(location)) {
    return location.entity.name;
  }

  const system = destination.lines[0];
  const planet = destination.lines[1];

  if (!isSystemLine(system)) {
    return undefined;
  }

  if (!isPlanetLine(planet)) {
    return system.entity.name;
  }

  const isPlanetNamed = planet.entity.name !== planet.entity.naturalId;

  if (isPlanetNamed) {
    return `${system.entity.name} - ${planet.entity.name}`;
  }

  const planetLetter = planet.entity.naturalId.replace(system.entity.naturalId, '');
  return `${system.entity.name} ${planetLetter}`;
}

export function isSystemLine(line?: PrunApi.AddressLine): line is PrunApi.SystemAddressLine {
  return line?.type === 'SYSTEM';
}

export function isStationLine(line?: PrunApi.AddressLine): line is PrunApi.StationAddressLine {
  return line?.type === 'STATION';
}

export function isPlanetLine(line?: PrunApi.AddressLine): line is PrunApi.PlanetAddressLine {
  return line?.type === 'PLANET';
}

export function isLocationLine(
  line?: PrunApi.AddressLine,
): line is PrunApi.PlanetAddressLine | PrunApi.StationAddressLine {
  return isPlanetLine(line) || isStationLine(line);
}

export function isSameAddress(
  addressA?: PrunApi.Address | null,
  addressB?: PrunApi.Address | null,
) {
  if (!addressA || !addressB || addressA.lines.length === 0 || addressB.lines.length === 0) {
    return false;
  }

  if (addressA.lines.length !== addressB.lines.length) {
    return false;
  }

  for (let i = 0; i < addressA.lines.length; i++) {
    const lineA = addressA.lines[i];
    const lineB = addressB.lines[i];
    if (lineA.type !== lineB.type) {
      return false;
    }
    if (lineA.type === 'ORBIT') {
      const orbitA = lineA.orbit;
      const orbitB = lineB.orbit;
      if (
        !orbitA ||
        !orbitB ||
        orbitA.semiMajorAxis !== orbitB.semiMajorAxis ||
        orbitA.eccentricity !== orbitB.eccentricity ||
        orbitA.inclination !== orbitB.inclination ||
        orbitA.rightAscension !== orbitB.rightAscension ||
        orbitA.periapsis !== orbitB.periapsis
      ) {
        return false;
      }
      continue;
    }
    if (!lineA.entity?.id || lineA.entity.id !== lineB.entity?.id) {
      return false;
    }
  }

  return true;
}
