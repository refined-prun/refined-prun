import { reactive } from 'vue';

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
});

export default user;
