import socketIOMiddleware from './socket-io-middleware';
import prun from '@src/prun-api/prun';
import user, {
  BaseSiteEntry,
  ProductionLineEntry,
  ProductionOrderEntry,
  ProductionSiteEntry,
  StorageEntry,
  WarehouseSiteEntry,
} from '@src/store/user';
import database from '@src/store/database/database';

let companyContext: string | undefined;

export async function listenPrunApi() {
  socketIOMiddleware<PrunApi.Packet>((context, payload) => {
    try {
      if (context === companyContext || !companyContext || !context) {
        processEvent(payload);
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  });
}

function processEvent(packet: PrunApi.Packet) {
  if (__DEV__ && packet.messageType !== 'ACTION_COMPLETED') {
    console.log(packet);
  }

  database.update(packet);

  switch (packet.messageType) {
    case 'ACTION_COMPLETED': {
      const message = packet.payload.message;
      if (message) {
        processEvent(message);
      }
      break;
    }
    case 'USER_DATA': {
      const context = packet.payload.contexts.find(x => x.type === 'COMPANY');
      companyContext = context?.id ?? companyContext;
      break;
    }
    case 'SITE_SITES': {
      user.sites = user.sites.filter(item => item.type !== 'BASE');

      for (const site of packet.payload.sites) {
        const siteData: BaseSiteEntry = {
          PlanetName: site.address.lines[1].entity.name,
          PlanetNaturalId: site.address.lines[1].entity.naturalId,
          siteId: site.siteId,
          buildings: [],
          type: 'BASE',
        };

        for (const building of site.platforms) {
          const buildingTicker = building.module.reactorTicker;

          const lastRepair = building.lastRepair?.timestamp ?? building.creationTime.timestamp;

          siteData.buildings.push({
            buildingTicker,
            lastRepair,
            condition: building.condition,
            reclaimableMaterials: building.reclaimableMaterials,
            repairMaterials: building.repairMaterials,
          });
        }

        user.sites.push(siteData);
      }

      if (user.storage.length > 0) {
        const planets = {};
        for (const site of user.sites) {
          planets[site.siteId] = [site.PlanetName, site.PlanetNaturalId];
        }
        for (const store of user.storage) {
          if (planets[store.addressableId]) {
            store.PlanetName = planets[store.addressableId][0];
            store.PlanetNaturalId = planets[store.addressableId][1];
          }
        }
      }
      break;
    }
    case 'STORAGE_STORAGES': {
      for (const store of packet.payload.stores) {
        const existingStore = user.storage.findIndex(item => item.id === store.id);

        const items = store.items
          .filter(x => x.quantity && x.quantity.material)
          .map(x => ({
            ...x,
            MaterialTicker: x.quantity.material.ticker,
            Amount: x.quantity.amount,
          }));

        const customStore: StorageEntry = {
          ...store,
          items,
        };

        if (existingStore != -1) {
          user.storage[existingStore] = customStore;
        } else {
          user.storage.push(customStore);
        }
      }

      // Assign planet names
      if (user.sites) {
        const planets = {};
        for (const site of user.sites) {
          planets[site.siteId] = [site.PlanetName, site.PlanetNaturalId];
        }
        for (const store of user.storage) {
          if (planets[store.addressableId]) {
            store.PlanetName = planets[store.addressableId][0];
            store.PlanetNaturalId = planets[store.addressableId][1];
          }
        }
      }
      break;
    }
    case 'STORAGE_CHANGE': {
      for (const store of packet.payload.stores) {
        const matchingStore = user.sites.find(item => item.siteId === store.addressableId);

        const index = user.storage.findIndex(item => item.addressableId === store.addressableId);
        const items = store.items
          .filter(x => x.quantity && x.quantity.material)
          .map(x => ({
            ...x,
            MaterialTicker: x.quantity.material.ticker,
            Amount: x.quantity.amount,
          }));

        if (matchingStore) {
          const customStore: StorageEntry = {
            ...store,
            PlanetName: matchingStore.PlanetName,
            PlanetNaturalId: matchingStore.PlanetNaturalId,
            items,
          };

          if (index != -1) {
            user.storage[index] = customStore;
          } else {
            user.storage.push(customStore);
          }
        } else if (store.name) {
          // Ship store
          const matchingShipStoreIndex = user.storage.findIndex(item => item.addressableId === store.addressableId);

          const customStore: StorageEntry = {
            ...store,
            items,
          };

          if (matchingShipStoreIndex != -1) {
            user.storage[matchingShipStoreIndex] = customStore;
          } else {
            user.storage.push(customStore);
          }
        }
      }
      break;
    }
    case 'WAREHOUSE_STORAGES': {
      user.sites = user.sites.filter(item => item.type !== 'WAREHOUSE');

      for (const warehouse of packet.payload.storages) {
        const siteData: WarehouseSiteEntry = {
          PlanetNaturalId: warehouse.address.lines[1].entity.naturalId,
          PlanetName: warehouse.address.lines[1].entity.name,
          type: 'WAREHOUSE',
          units: warehouse.units,
          siteId: warehouse.warehouseId,
        };

        user.sites.push(siteData);
      }
      break;
    }
    case 'WORKFORCE_WORKFORCES': {
      const matchIndex = user.workforce.findIndex(item => item.siteId === packet.payload.siteId);
      const planetId = packet.payload.address.lines[1].entity.naturalId;
      const planetName = packet.payload.address.lines[1].entity.name;

      const workforceInfo = {
        PlanetName: planetName,
        PlanetNaturalId: planetId,
        workforce: packet.payload.workforces,
        siteId: packet.payload.siteId,
      };

      if (matchIndex != -1) {
        user.workforce[matchIndex] = workforceInfo;
      } else {
        user.workforce.push(workforceInfo);
      }

      break;
    }
    case 'PRODUCTION_SITE_PRODUCTION_LINES': {
      const matchIndex = user.production.findIndex(item => item.siteId === packet.payload.siteId);

      const siteInfo: ProductionSiteEntry = {
        PlanetName: '',
        PlanetNaturalId: '',
        lines: [],
        siteId: packet.payload.siteId,
      };
      for (const line of packet.payload.productionLines) {
        const prodLine: ProductionLineEntry = {
          PlanetName: line.address.lines[1].entity.name,
          PlanetNaturalId: line.address.lines[1].entity.naturalId,
          capacity: line.capacity,
          condition: line.condition,
          efficiency: line.efficiency,
          efficiencyFactors: line.efficiencyFactors,
          type: line.type,
          orders: [],
        };

        for (const order of line.orders) {
          const orderInfo: ProductionOrderEntry = {
            completed: order.completed,
            started: order.started ? order.started.timestamp : order.started,
            duration: order.duration ? order.duration.millis : Infinity, // Did this null value kill stuff down the line?
            halted: order.halted,
            productionFee: order.productionFee,
            recurring: order.recurring,
            inputs: order.inputs.map(x => ({ MaterialTicker: x.material.ticker, Amount: x.amount })),
            outputs: order.outputs.map(x => ({ MaterialTicker: x.material.ticker, Amount: x.amount })),
          };

          prodLine.orders.push(orderInfo);
        }

        siteInfo.lines.push(prodLine);
      }

      if (siteInfo.lines[0]) {
        siteInfo.PlanetName = siteInfo.lines[0].PlanetName;
        siteInfo.PlanetNaturalId = siteInfo.lines[0].PlanetNaturalId;
      }

      if (matchIndex != -1) {
        user.production[matchIndex] = siteInfo;
      } else {
        user.production.push(siteInfo);
      }
      break;
    }
    case 'COMPANY_DATA': {
      user.company.name = packet.payload.name;
      user.company.id = packet.payload.id;
      break;
    }
    case 'ACCOUNTING_CASH_BALANCES': {
      user.currency = packet.payload.currencyAccounts.map(x => x.currencyBalance);
      break;
    }
    case 'WORLD_MATERIAL_CATEGORIES': {
      prun.materials.applyApiPayload(packet.payload);
      break;
    }
    case 'SYSTEM_STARS_DATA': {
      prun.systems.applyApiPayload(packet.payload);
      break;
    }
  }
}
