import { reactive } from 'vue';

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
  sites: [] as (BaseSiteEntry | WarehouseSiteEntry)[],
  storage: [] as StorageEntry[],
});

export default user;
