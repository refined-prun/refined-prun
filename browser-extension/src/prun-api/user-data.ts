export const userData = {
  sites: [],
  storage: [],
  workforce: [],
  contracts: [],
  production: [],
  currency: [],
  cxos: [] as PrunApi.COMEX_TRADER_ORDERS.Order[],
  fxos: [] as PrunApi.FOREX_TRADER_ORDERS.Order[],
  cxob: {} as { [key: string]: PrunApi.COMEX_BROKER_DATA.Payload & { timestamp: number } },
  ships: [] as PrunApi.SHIP_SHIPS.Ship[],
};
