/* eslint-disable @typescript-eslint/no-explicit-any */
import { transmitted_events } from './default-event-payload';
import { socketIOMiddleware } from './socket-io-middleware';
import system from '@src/system';
import prun from '@src/prun-api/prun';
import user, {
  BaseSiteEntry,
  ProductionLineEntry,
  ProductionOrderEntry,
  ProductionSiteEntry,
  StorageEntry,
  WarehouseSiteEntry,
} from '@src/store/user';

interface ApiEvent {
  payload: any;
  context: string | undefined;
}

export async function listenPrunApi() {
  const contextStorage = await system.storage.local.get('PMMGContext');
  if (contextStorage['PMMGContext']) {
    companyContext = contextStorage['PMMGContext'];
  }
  socketIOMiddleware((context, payload) => {
    QueueEvent({ context, payload });
    return false;
  });
}

const eventQueue: ApiEvent[] = [];
let processingQueue = false;

let companyContext;

const loggedMessageTypes = [
  'COMEX_BROKER_DATA',
  'SITE_SITES',
  'STORAGE_STORAGES',
  'WAREHOUSE_STORAGES',
  'WORKFORCE_WORKFORCES',
  'CONTRACTS_CONTRACTS',
  'CONTRACTS_CONTRACT',
  'PRODUCTION_SITE_PRODUCTION_LINES',
  'COMPANY_DATA',
  'FOREX_TRADER_ORDERS',
  'COMEX_TRADER_ORDERS',
  'STORAGE_CHANGE',
  'COMPANY_DATA',
  'SHIP_SHIPS',
  'WORLD_MATERIAL_CATEGORIES',
  'ACCOUNTING_CASH_BALANCES',
  'SYSTEM_STARS_DATA',
];

async function ProcessEvent(apiEvent: ApiEvent, event_list, full_event?) {
  const eventData = apiEvent.payload;
  // Log everything
  /*
  const badTypes = ["ACTION_COMPLETED", "DATA_DATA", "CHANNEL_DATA", "CHANNEL_USER_LIST", "CHANNEL_UNSEEN_MESSAGES_COUNT"];
  if(eventData && !badTypes.includes(eventData.messageType))
  {
    console.log(eventData.messageType);
    console.log(eventData);
  }*/

  // Detect bad events
  if (typeof eventData === 'undefined' || eventData === null || typeof eventData.messageType === 'undefined') {
    return;
  }

  const isCompanyContext =
    apiEvent.context === undefined ||
    companyContext === undefined ||
    companyContext === null ||
    apiEvent.context == companyContext;
  if (!isCompanyContext) {
    // We're running under a non-company context
    //console.log("Running under non-company context!");
    return;
  }

  // Handle determining the current context
  if (
    eventData.messageType == 'ACTION_COMPLETED' &&
    eventData.payload &&
    eventData.payload.message &&
    eventData.payload.message.messageType == 'USER_DATA' &&
    eventData.payload.message.payload &&
    eventData.payload.message.payload.contexts
  ) {
    console.log('Found USER_DATA payload');
    for (const context in eventData.payload.message.payload.contexts) {
      if (eventData.payload.message.payload.contexts[context].type == 'COMPANY') {
        companyContext = eventData.payload.message.payload.contexts[context].id;
        await system.storage.local.set({ PMMGContext: companyContext });
        console.log(`Found company context: ${companyContext}`);
        break;
      }
    }
  }

  //console.debug(eventData);

  // Log Events into Storage
  if (eventData && eventData.messageType && loggedMessageTypes.includes(eventData.messageType)) {
    //console.log("Logging Event into Storage");
    const userInfo = await system.storage.local.get('PMMG-User-Info');
    await logEvent(userInfo, eventData);
    await sleep(50);
    return;
  }

  // Process Events
  if (eventData.messageType in event_list) {
    console.debug(`Event to process: ${eventData.messageType}`);
    if (typeof full_event === 'undefined') {
      full_event = eventData;
    }
    const match_event = event_list[eventData.messageType];
    if (typeof match_event === 'undefined') {
      console.error('messagetype should be in list, but we still failed?');
    }

    if (match_event.action == 'subprocess_payload') {
      //console.log("Processing Subevent")
      console.log(eventData.payload.message);
      await ProcessEvent(
        {
          payload: eventData.payload.message,
          context: apiEvent.context,
        },
        match_event.payload_events,
        full_event,
      );
    }
  } else {
    //console.debug("Event not found: " + eventData.messageType);
  }
}

async function QueueEvent(apiEvent: ApiEvent) {
  //console.debug("Queue event; eventQueue.size " + eventQueue.length);
  //console.debug("Queue event; processing? " + processingQueue);

  eventQueue.push(apiEvent);
  if (!processingQueue) {
    processingQueue = true;
    //console.debug("Queue event processing; queue size? " + eventQueue.length);

    let currentEvent = eventQueue.shift();
    //console.log("Waiting to Process Event");
    while (currentEvent !== undefined) {
      await ProcessEvent(currentEvent, transmitted_events);
      //console.log("Queue event processing check; queue size? " + eventQueue.length);
      currentEvent = eventQueue.shift();
    }

    processingQueue = false;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Turn the eventdata received by PrUN into a form stored and readable by PMMG
// result: Dictionary with the key "PMMG-User-Info" that contains all the user's stored game data info
// eventdata: The message sent from the server containing updated game data info
async function logEvent(result, eventdata: PrunApi.Packet) {
  console.log(eventdata.messageType);
  // Reset it every time for testing
  //result["PMMG-User-Info"] = {};

  // Initialize it if not initialized
  if (!result['PMMG-User-Info']) {
    result['PMMG-User-Info'] = {};
  }

  if (!result['PMMG-User-Info']['contracts']) {
    result['PMMG-User-Info']['contracts'] = [];
  }
  if (!result['PMMG-User-Info']['currency']) {
    result['PMMG-User-Info']['currency'] = [];
  }

  let matchIndex: any;
  let planetId: any;
  let planetName: any;
  let badParams: any;
  let matchingContract: any;
  let badKeys: any;

  switch (eventdata.messageType) {
    case 'SITE_SITES':
      user.sites = user.sites.filter(item => item.type !== 'BASE');

      for (const site of eventdata.payload.sites) {
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
    case 'STORAGE_STORAGES': {
      for (const store of eventdata.payload.stores) {
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
    case 'STORAGE_CHANGE':
      for (const store of eventdata.payload.stores) {
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
    case 'WAREHOUSE_STORAGES':
      user.sites = user.sites.filter(item => item.type !== 'WAREHOUSE');

      for (const warehouse of eventdata.payload.storages) {
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
    case 'WORKFORCE_WORKFORCES': {
      matchIndex = user.workforce.findIndex(item => item.siteId === eventdata.payload.siteId);
      planetId = eventdata.payload.address.lines[1].entity.naturalId;
      planetName = eventdata.payload.address.lines[1].entity.name;

      const workforceInfo = {
        PlanetName: planetName,
        PlanetNaturalId: planetId,
        workforce: eventdata.payload.workforces,
        siteId: eventdata.payload.siteId,
      };

      if (matchIndex != -1) {
        user.workforce[matchIndex] = workforceInfo;
      } else {
        user.workforce.push(workforceInfo);
      }

      break;
    }
    case 'CONTRACTS_CONTRACTS':
      badParams = [
        'id',
        'canExtend',
        'canRequestTermination',
        'extensionDeadline',
        'terminationReceived',
        'terminationSent',
      ];
      eventdata.payload.contracts.forEach(contract => {
        badParams.forEach(param => {
          delete contract[param];
        });
        contract.conditions.forEach(condition => {
          // @ts-expect-error TODO: Why do you even delete this
          delete condition.id;
        });
      });

      result['PMMG-User-Info'].contracts = eventdata.payload.contracts;
      break;
    case 'CONTRACTS_CONTRACT':
      badKeys = [
        'id',
        'canExtend',
        'canRequestTermination',
        'extensionDeadline',
        'terminationReceived',
        'terminationSent',
      ];
      matchingContract = result['PMMG-User-Info'].contracts.find(obj => obj.localId === eventdata.payload.localId);
      if (matchingContract) {
        // Copy new object into old
        const oldKeys = Object.keys(matchingContract);
        oldKeys.forEach(key => {
          delete matchingContract[key];
        });
        const newKeys = Object.keys(eventdata.payload);
        newKeys.forEach(key => {
          if (!badKeys.includes(key)) {
            matchingContract[key] = eventdata.payload[key];
          }
        });
      } // Otherwise push it in its entirety. Doesn't get rid of uneccessary params, but that's fine. They'll be wiped on the next full reload.
      else {
        result['PMMG-User-Info'].contracts.push(eventdata.payload);
      }
      break;
    case 'PRODUCTION_SITE_PRODUCTION_LINES': {
      matchIndex = user.production.findIndex(item => item.siteId === eventdata.payload.siteId);

      const siteInfo: ProductionSiteEntry = {
        PlanetName: '',
        PlanetNaturalId: '',
        lines: [],
        siteId: eventdata.payload.siteId,
      };
      for (const line of eventdata.payload.productionLines) {
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
    case 'COMPANY_DATA':
      user.company.name = eventdata.payload.name;
      user.company.id = eventdata.payload.id;
      break;
    case 'ACCOUNTING_CASH_BALANCES':
      result['PMMG-User-Info'].currency = [];

      console.log(eventdata.payload);

      if (eventdata.payload.currencyAccounts) {
        eventdata.payload.currencyAccounts.forEach(account => {
          result['PMMG-User-Info'].currency.push(account.currencyBalance);
        });
      }
      break;
    case 'FOREX_TRADER_ORDERS':
      user.fxos = eventdata.payload.orders;
      console.log(user.fxos);
      break;
    case 'COMEX_TRADER_ORDERS':
      user.cxos = eventdata.payload.orders;
      break;
    case 'COMEX_BROKER_DATA':
      user.cxob[eventdata.payload.ticker] = {
        ...eventdata.payload,
        timestamp: Date.now(),
      };

      Object.keys(user.cxob).forEach(ticker => {
        if (Date.now() - user.cxob[ticker].timestamp > 900000) {
          delete user.cxob[ticker];
        }
      });
      break;
    case 'SHIP_SHIPS': {
      user.ships = eventdata.payload.ships;
      break;
    }
    case 'WORLD_MATERIAL_CATEGORIES': {
      prun.materials.applyApiPayload(eventdata.payload);
      break;
    }
    case 'SYSTEM_STARS_DATA': {
      prun.systems.applyApiPayload(eventdata.payload);
      break;
    }
  }

  console.log(result);
  //console.log("Finished Logging Event, now Setting...");
  await system.storage.local.set(result);
}
