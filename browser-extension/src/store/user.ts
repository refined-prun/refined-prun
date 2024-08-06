import { reactive } from '@vue/reactivity';

export interface WorkforceEntry {
  PlanetName: string;
  PlanetNaturalId: string;
  workforce: PrunApi.WORKFORCE_WORKFORCES.Workforce[];
  siteId: string;
}

export interface ProductionSiteEntry {
  PlanetName: string;
  PlanetNaturalId: string;
  lines: ProductionLineEntry[];
  siteId: string;
}

export interface ProductionLineEntry {
  PlanetName: string;
  PlanetNaturalId: string;
  capacity: number;
  condition: number;
  efficiency: number;
  efficiencyFactors: PrunApi.PRODUCTION_SITE_PRODUCTION_LINES.EfficiencyFactor[];
  type: string;
  orders: ProductionOrderEntry[];
}

export interface ProductionOrderEntry {
  completed: number;
  started: number | null;
  duration: number;
  halted: boolean;
  productionFee: PrunApi.CurrencyAmount;
  recurring: boolean;
  inputs: { MaterialTicker: string; Amount: number }[];
  outputs: { MaterialTicker: string; Amount: number }[];
}

export interface StorageEntry extends PrunApi.Store {
  items: StoreItem[];
  PlanetName?: string;
  PlanetNaturalId?: string;
}

export interface StoreItem extends PrunApi.StoreItem {
  MaterialTicker: string;
  Amount: number;
}

export interface SiteEntry {
  PlanetName: string;
  PlanetNaturalId: string;
  siteId: string;
  type: 'BASE' | 'WAREHOUSE';
}

export interface BaseSiteEntry extends SiteEntry {
  type: 'BASE';
  buildings: SiteBuilding[];
}

export interface WarehouseSiteEntry extends SiteEntry {
  type: 'WAREHOUSE';
  units: number;
}

export interface SiteBuilding {
  buildingTicker: string;
  lastRepair: number;
  condition: number;
  reclaimableMaterials: PrunApi.MaterialAmount[];
  repairMaterials: PrunApi.MaterialAmount[];
}

const user = reactive({
  company: {
    name: '',
    id: '',
  },
  sites: [] as (BaseSiteEntry | WarehouseSiteEntry)[],
  storage: [] as StorageEntry[],
  workforce: [] as WorkforceEntry[],
  production: [] as ProductionSiteEntry[],
  currency: [] as PrunApi.CurrencyAmount[],
  fxos: [] as PrunApi.FXOrder[],
  cxob: {} as { [key: string]: PrunApi.COMEX_BROKER_DATA.Payload & { timestamp: number } },
  ships: [] as PrunApi.SHIP_SHIPS.Ship[],
});

export default user;
