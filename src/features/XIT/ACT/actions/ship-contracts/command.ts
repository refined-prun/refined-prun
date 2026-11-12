// The game rejects buffer commands with '/', so ad keys use '.' instead.
export function getShipContractsCommand(ship: string, destination: string, adKeys: string[]) {
  return `XIT SHPTACT ${ship} ${destination} ${adKeys.map(x => x.replace('/', '.')).join(' ')}`;
}

export function parseShipContractsAdKey(parameter: string) {
  return parameter.replace('.', '/');
}
