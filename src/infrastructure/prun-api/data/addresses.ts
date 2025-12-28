import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';

type State = Record<string, PrunApi.Address | null | undefined>;

const state = shallowReactive<State>({});

onApiMessage({
  SHIP_SHIPS(data: { ships: PrunApi.Ship[] }) {
    for (const ship of data.ships) {
      state[ship.id] = ship.address;
    }
  },
  SHIP_DATA(data: PrunApi.Ship) {
    state[data.id] = data.address;
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
      state[storage.storeId] = storage.address;
    }
  },
  WAREHOUSE_STORAGE(data: PrunApi.Warehouse) {
    state[data.storeId] = data.address;
  },
});

export const addressesStore = {
  ...state,
};

export const getEntityNaturalIdFromAddress = (address?: PrunApi.Address | undefined) => {
  return getLocationLineFromAddress(address)?.entity.naturalId;
};

export const getEntityNameFromAddress = (address?: PrunApi.Address | undefined) => {
  const location = getLocationLineFromAddress(address);
  if (!location) {
    return undefined;
  }

  if (location.type !== 'PLANET' || location.entity.name !== location.entity.naturalId) {
    return location.entity.name;
  }

  const system = getSystemLineFromAddress(address);
  if (!system || system.entity.name === system.entity.naturalId) {
    return location.entity.name;
  }

  return location.entity.name.replace(system.entity.naturalId, `${system.entity.name} `);
};

export const getSystemLineFromAddress = (address?: PrunApi.Address | undefined) => {
  if (!address) {
    return undefined;
  }
  return isSystemLine(address.lines[0]) ? address.lines[0] : address.lines.find(isSystemLine);
};

export const getLocationLineFromAddress = (address?: PrunApi.Address | undefined) => {
  if (!address) {
    return undefined;
  }
  return isLocationLine(address.lines[1]) ? address.lines[1] : address.lines.find(isLocationLine);
};

export function getDestinationName(destination?: PrunApi.Address) {
  if (!destination) {
    return undefined;
  }

  const location = getLocationLineFromAddress(destination);
  if (location?.type === 'STATION') {
    return location.entity.naturalId;
  }

  return getEntityNameFromAddress(destination);
}

export function getDestinationFullName(destination?: PrunApi.Address) {
  if (!destination) {
    return undefined;
  }

  const location = getLocationLineFromAddress(destination);
  if (location?.type === 'STATION') {
    return location.entity.name;
  }

  const system = destination.lines[0];
  const planet = destination.lines[1];

  if (system === undefined) {
    return undefined;
  }

  if (planet === undefined) {
    return system.entity.name;
  }

  const isPlanetNamed = planet.entity.name !== planet.entity.naturalId;

  if (isPlanetNamed) {
    return `${system.entity.name} - ${planet.entity.name}`;
  }

  const planetLetter = planet.entity.naturalId.replace(system.entity.naturalId, '');
  return `${system.entity.name} ${planetLetter}`;
}

function isSystemLine(line?: PrunApi.AddressLine) {
  return line?.type === 'SYSTEM';
}

function isLocationLine(line?: PrunApi.AddressLine) {
  return line?.type === 'PLANET' || line?.type === 'STATION';
}

export function isSameAddress(
  addressA?: PrunApi.Address | null,
  addressB?: PrunApi.Address | null,
) {
  if (!addressA || !addressB) {
    return false;
  }

  if (addressA === addressB) {
    return true;
  }

  for (let i = 0; i < addressA.lines.length; i++) {
    const lineA = addressA.lines[i];
    const lineB = addressB.lines[i];
    if (lineA === undefined || lineB === undefined || lineA.entity.id !== lineB.entity.id) {
      return false;
    }
  }

  return true;
}
