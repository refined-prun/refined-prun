export function UI_WINDOWS_UPDATE_SIZE(id: string, width: number, height: number) {
  return {
    messageType: 'UI_WINDOWS_UPDATE_SIZE',
    payload: {
      id: id,
      size: {
        width: width,
        height: height,
      },
    },
  };
}

export function UI_TILES_CHANGE_COMMAND(id: string, command: string | null) {
  return {
    messageType: 'UI_TILES_CHANGE_COMMAND',
    payload: {
      id: id,
      newCommand: command,
    },
  };
}

export function UI_WINDOWS_REQUEST_FOCUS(id: string) {
  return {
    messageType: 'UI_WINDOWS_REQUEST_FOCUS',
    payload: {
      id: id,
    },
  };
}

export function WORLD_SECTORS(sectors: PrunApi.Sector[]) {
  return {
    messageType: 'WORLD_SECTORS',
    payload: {
      sectors: sectors,
    },
  };
}

export function COMEX_BROKER_PRICES(prices: PrunApi.CXBrokerPrices) {
  return {
    messageType: 'COMEX_BROKER_PRICES',
    payload: prices,
  };
}
