import socketIOMiddleware from './socket-io-middleware';
import user, { BaseSiteEntry, StorageEntry, WarehouseSiteEntry } from '@src/store/user';
import { dispatch } from '@src/prun-api/data/api-messages';

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
  if (__DEV__) {
    performance.mark(`${packet.messageType}-START`);
  }

  if (__DEV__ && packet.messageType !== 'ACTION_COMPLETED') {
    console.log(packet);
  }

  if (packet.messageType === 'ACTION_COMPLETED') {
    const message = packet.payload?.message;
    if (message) {
      const storeAction = {
        type: message.messageType,
        data: message.payload,
      };
      dispatch(storeAction);
      message['dispatched'] = true;
    }
  } else if (!packet['dispatched']) {
    const storeAction = {
      type: packet.messageType,
      data: packet.payload,
    };
    dispatch(storeAction);
  }

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
          const matchingShipStoreIndex = user.storage.findIndex(
            item => item.addressableId === store.addressableId,
          );

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
  }

  if (__DEV__) {
    performance.mark(`${packet.messageType}-END`);
    performance.measure(
      packet.messageType,
      `${packet.messageType}-START`,
      `${packet.messageType}-END`,
    );
  }
}
