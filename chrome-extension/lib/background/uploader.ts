/* eslint-disable @typescript-eslint/no-explicit-any */
import { transmitted_events } from '@lib/background/default_event_payload';

const eventQueue: any[] = [];
let processingqueue = false;

let companyContext;

getLocalStorage('PMMGContext', function (result) {
  if (result['PMMGContext']) {
    companyContext = result['PMMGContext'];
  }
});

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
  'ACCOUNTING_CASH_BALANCES',
];

async function ProcessEvent(eventdata, event_list, full_event?) {
  // Log everything
  /*
  const badTypes = ["ACTION_COMPLETED", "DATA_DATA", "CHANNEL_DATA", "CHANNEL_USER_LIST", "CHANNEL_UNSEEN_MESSAGES_COUNT"];
  if(eventdata && !badTypes.includes(eventdata.messageType))
  {
    console.log(eventdata.messageType);
    console.log(eventdata);
  }*/

  // Detect bad events
  if (typeof eventdata === 'undefined' || eventdata === null || typeof eventdata.messageType === 'undefined') {
    return;
  }

  const isCompanyContext =
    eventdata.pmmg_context === undefined ||
    eventdata.pmmg_context === null ||
    companyContext === undefined ||
    companyContext === null ||
    eventdata.pmmg_context == companyContext;
  if (!isCompanyContext) {
    // We're running under a non-company context
    //console.log("Running under non-company context!");
    return;
  }

  // Handle determining the current context
  if (
    eventdata.messageType == 'ACTION_COMPLETED' &&
    eventdata.payload &&
    eventdata.payload.message &&
    eventdata.payload.message.messageType == 'USER_DATA' &&
    eventdata.payload.message.payload &&
    eventdata.payload.message.payload.contexts
  ) {
    console.log('Found USER_DATA payload');
    for (const context in eventdata.payload.message.payload.contexts) {
      if (eventdata.payload.message.payload.contexts[context].type == 'COMPANY') {
        companyContext = eventdata.payload.message.payload.contexts[context].id;
        setSettings({ PMMGContext: companyContext });
        console.log('Found company context: ' + companyContext);
        break;
      }
    }
  }

  //console.debug(eventdata);

  // Log Events into Storage
  if (eventdata && eventdata.messageType && loggedMessageTypes.includes(eventdata.messageType)) {
    //console.log("Logging Event into Storage");
    await getLocalStorage('PMMG-User-Info', logEvent, eventdata);
    await sleep(50);
    return;
  }

  // Process Events
  if (eventdata.messageType in event_list) {
    console.debug('Event to process: ' + eventdata.messageType);
    if (typeof full_event === 'undefined') {
      full_event = eventdata;
    }
    const match_event = event_list[eventdata.messageType];
    if (typeof match_event === 'undefined') {
      console.error('messagetype should be in list, but we still failed?');
    }

    if (match_event.action == 'subprocess_payload') {
      //console.log("Processing Subevent")
      await ProcessEvent(eventdata.payload.message, match_event.payload_events, full_event);
    }
  } else {
    //console.debug("Event not found: " + eventdata.messageType);
  }
}

export function ProcessMessage(event) {
  //console.log("Processing Mesage");
  // Do stuff with event.data (received data).
  const re_event = /^[0-9:\s]*(?<event>\[\s*"event".*\])[\s0-9:.]*/m;
  //console.log(re_event);
  //console.log(event.data);
  const result = event.data.match(re_event);
  //console.log(result);
  if (result && result.groups && result.groups.event) {
    const eventdata = JSON.parse(result.groups.event)[1];
    //console.log("Event found");
    //console.log(eventdata);
    //console.log("Queueing Event");
    QueueEvent(eventdata);
  }
}

async function QueueEvent(eventdata) {
  //console.debug("Queue event; eventQueue.size " + eventQueue.length);
  //console.debug("Queue event; processing? " + processingqueue);

  eventQueue.push(eventdata);
  if (processingqueue === false) {
    processingqueue = true;
    //console.debug("Queue event processing; queue size? " + eventQueue.length);

    let currentEvent = eventQueue.shift();
    //console.log("Waiting to Process Event");
    while (currentEvent !== undefined) {
      await ProcessEvent(currentEvent, transmitted_events);
      //console.log("Queue event processing check; queue size? " + eventQueue.length);
      currentEvent = eventQueue.shift();
    }

    processingqueue = false;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Turn the eventdata received by PrUN into a form stored and readable by PMMG
// result: Dictionary with the key "PMMG-User-Info" that contains all the user's stored game data info
// eventdata: The message sent from the server containing updated game data info
async function logEvent(result, eventdata) {
  console.log(eventdata.messageType);
  // Reset it every time for testing
  //result["PMMG-User-Info"] = {};

  // Initialize it if not initialized
  if (!result['PMMG-User-Info']) {
    result['PMMG-User-Info'] = {};
  }

  if (!result['PMMG-User-Info']['sites']) {
    result['PMMG-User-Info']['sites'] = [];
  }
  if (!result['PMMG-User-Info']['storage']) {
    result['PMMG-User-Info']['storage'] = [];
  }
  if (!result['PMMG-User-Info']['workforce']) {
    result['PMMG-User-Info']['workforce'] = [];
  }
  if (!result['PMMG-User-Info']['contracts']) {
    result['PMMG-User-Info']['contracts'] = [];
  }
  if (!result['PMMG-User-Info']['production']) {
    result['PMMG-User-Info']['production'] = [];
  }
  if (!result['PMMG-User-Info']['currency']) {
    result['PMMG-User-Info']['currency'] = [];
  }
  if (!result['PMMG-User-Info']['cxos']) {
    result['PMMG-User-Info']['cxos'] = [];
  }
  if (!result['PMMG-User-Info']['fxos']) {
    result['PMMG-User-Info']['fxos'] = [];
  }
  if (!result['PMMG-User-Info']['cxob']) {
    result['PMMG-User-Info']['cxob'] = {};
  }
  if (!result['PMMG-User-Info']['ships']) {
    result['PMMG-User-Info']['ships'] = {};
  }

  let matchIndex: any;
  let planetId: any;
  let planetName: any;
  let workforceArray: any;
  let badParams: any;
  let matchingContract: any;
  let siteInfo: any;
  let badKeys: any;

  switch (eventdata.messageType) {
    case 'SITE_SITES':
      result['PMMG-User-Info']['sites'] = result['PMMG-User-Info']['sites'].filter(item => item.type !== 'BASE');

      eventdata['payload']['sites'].forEach(site => {
        const planetId = site['address']['lines'][1]['entity']['naturalId'];
        const planetName = site['address']['lines'][1]['entity']['name'];

        const siteData = {
          PlanetName: planetName,
          PlanetNaturalId: planetId,
          siteId: site['siteId'],
          buildings: <unknown[]>[],
          type: 'BASE',
        };

        site['platforms'].forEach(building => {
          const buildingTicker = building['module']['reactorTicker'];

          const lastRepair = building['lastRepair']
            ? building['lastRepair']['timestamp']
            : building['creationTime']['timestamp'];

          siteData['buildings'].push({
            buildingTicker: buildingTicker,
            lastRepair: lastRepair,
            condition: building['condition'],
            reclaimableMaterials: building['reclaimableMaterials'],
            repairMaterials: building['repairMaterials'],
          });
        });

        result['PMMG-User-Info']['sites'].push(siteData);
      });

      if (result['PMMG-User-Info']['storage']) {
        const planets = {};
        result['PMMG-User-Info']['sites'].forEach(site => {
          planets[site.siteId] = [site.PlanetName, site.PlanetNaturalId];
        });
        result['PMMG-User-Info']['storage'].forEach(store => {
          if (planets[store.addressableId]) {
            store.PlanetName = planets[store.addressableId][0];
            store.PlanetNaturalId = planets[store.addressableId][1];
          }
        });
      }
      break;
    case 'STORAGE_STORAGES':
      //console.log(eventdata.payload.stores);
      eventdata['payload']['stores'].forEach(store => {
        const duplicateStoreIndex = result['PMMG-User-Info']['storage'].findIndex(item => item.id === store['id']);

        const givenItems = store['items'];
        store['items'] = [];
        givenItems.forEach(item => {
          if (item.quantity && item.quantity.material) {
            store['items'].push({
              weight: item['weight'],
              volume: item['volume'],
              MaterialTicker: item['quantity']['material']['ticker'],
              Amount: item['quantity']['amount'],
            });
          }
        });

        if (duplicateStoreIndex != -1) {
          result['PMMG-User-Info']['storage'][duplicateStoreIndex] = store;
        } else {
          result['PMMG-User-Info']['storage'].push(store);
        }
      });

      // Assign planet names

      if (result['PMMG-User-Info']['sites']) {
        const planets = {};
        result['PMMG-User-Info']['sites'].forEach(site => {
          planets[site.siteId] = [site.PlanetName, site.PlanetNaturalId];
        });
        result['PMMG-User-Info']['storage'].forEach(store => {
          if (planets[store.addressableId]) {
            store.PlanetName = planets[store.addressableId][0];
            store.PlanetNaturalId = planets[store.addressableId][1];
          }
        });
      }
      break;
    case 'STORAGE_CHANGE':
      eventdata.payload.stores.forEach(store => {
        const matchingStore = result['PMMG-User-Info']['sites'].find(item => item.siteId === store['addressableId']);

        const index = result['PMMG-User-Info']['storage'].findIndex(item => item.addressableId === store.addressableId);

        if (matchingStore) {
          store['PlanetNaturalId'] = matchingStore['PlanetNaturalId'];
          store['PlanetName'] = matchingStore['PlanetName'];
          const givenItems = store['items'];
          store['items'] = [];
          givenItems.forEach(item => {
            if (item.quantity && item.quantity.material) {
              store['items'].push({
                weight: item['weight'],
                volume: item['volume'],
                MaterialTicker: item['quantity']['material']['ticker'],
                Amount: item['quantity']['amount'],
              });
            } else {
              //console.log(item); // Debug line. Some items seem to not have a quantity. This should help figure out what those are.
            }
          });

          if (index != -1) {
            result['PMMG-User-Info']['storage'][index] = store;
          } else {
            result['PMMG-User-Info']['storage'].push(store);
          }
        } else if (store['name']) {
          // Ship store
          const matchingShipStoreIndex = result['PMMG-User-Info']['storage'].findIndex(
            item => item.addressableId === store['addressableId'],
          );

          const givenItems = store['items'];
          store['items'] = [];
          givenItems.forEach(item => {
            if (item.quantity && item.quantity.material) {
              store['items'].push({
                weight: item['weight'],
                volume: item['volume'],
                MaterialTicker: item['quantity']['material']['ticker'],
                Amount: item['quantity']['amount'],
              });
            } else {
              //console.log(item); // Debug line. Some items seem to not have a quantity. This should help figure out what those are.
            }
          });

          if (matchingShipStoreIndex != -1) {
            result['PMMG-User-Info']['storage'][matchingShipStoreIndex] = store;
          } else {
            result['PMMG-User-Info']['storage'].push(store);
          }
        }
      });
      break;
    case 'WAREHOUSE_STORAGES':
      result['PMMG-User-Info']['sites'] = result['PMMG-User-Info']['sites'].filter(item => item.type !== 'WAREHOUSE');

      eventdata['payload']['storages'].forEach(warehouse => {
        const planetId = warehouse['address']['lines'][1]['entity']['naturalId'];
        const planetName = warehouse['address']['lines'][1]['entity']['name'];

        const siteData = {
          PlanetNaturalId: planetId,
          PlanetName: planetName,
          type: 'WAREHOUSE',
          units: warehouse['units'],
          siteId: warehouse['warehouseId'],
        };

        result['PMMG-User-Info']['sites'].push(siteData);
      });
      break;
    case 'WORKFORCE_WORKFORCES':
      matchIndex = result['PMMG-User-Info']['workforce'].findIndex(
        item => item.siteId === eventdata['payload']['siteId'],
      );
      planetId = eventdata['payload']['address']['lines'][1]['entity']['naturalId'];
      planetName = eventdata['payload']['address']['lines'][1]['entity']['name'];

      workforceArray = {
        PlanetName: planetName,
        PlanetNaturalId: planetId,
        workforce: eventdata['payload']['workforces'],
        siteId: eventdata['payload']['siteId'],
      };

      if (matchIndex != -1) {
        result['PMMG-User-Info']['workforce'][matchIndex] = workforceArray;
      } else {
        result['PMMG-User-Info']['workforce'].push(workforceArray);
      }

      break;
    case 'CONTRACTS_CONTRACTS':
      badParams = [
        'id',
        'canExtend',
        'canRequestTermination',
        'extensionDeadline',
        'terminationReceived',
        'terminationSent',
      ];
      eventdata['payload']['contracts'].forEach(contract => {
        badParams.forEach(param => {
          delete contract[param];
        });
        contract['conditions'].forEach(condition => {
          delete condition['id'];
        });
      });

      result['PMMG-User-Info']['contracts'] = eventdata['payload']['contracts'];
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
      matchingContract = result['PMMG-User-Info']['contracts'].find(
        obj => obj.localId === eventdata['payload']['localId'],
      );
      if (matchingContract) {
        // Copy new object into old
        const oldKeys = Object.keys(matchingContract);
        oldKeys.forEach(key => {
          delete matchingContract[key];
        });
        const newKeys = Object.keys(eventdata['payload']);
        newKeys.forEach(key => {
          if (!badKeys.includes(key)) {
            matchingContract[key] = eventdata['payload'][key];
          }
        });
      } // Otherwise push it in its entirety. Doesn't get rid of uneccessary params, but that's fine. They'll be wiped on the next full reload.
      else {
        result['PMMG-User-Info']['contracts'].push(eventdata['payload']);
      }
      break;
    case 'PRODUCTION_SITE_PRODUCTION_LINES':
      //console.log(eventdata["payload"]);
      matchIndex = result['PMMG-User-Info']['production'].findIndex(
        item => item.siteId === eventdata['payload']['siteId'],
      );

      siteInfo = { lines: [], siteId: eventdata['payload']['siteId'] };
      eventdata['payload']['productionLines'].forEach(line => {
        const planetId = line['address']['lines'][1]['entity']['naturalId'];
        const planetName = line['address']['lines'][1]['entity']['name'];

        const prodLine = {
          PlanetName: planetName,
          PlanetNaturalId: planetId,
          capacity: line['capacity'],
          condition: line['condition'],
          efficiency: line['efficiency'],
          efficiencyFactors: line['efficiencyFactors'],
          type: line['type'],
          orders: <any[]>[],
        };

        line['orders'].forEach(order => {
          const orderInfo: any = {};
          orderInfo.completed = order.completed;
          orderInfo.started = order.started ? order.started.timestamp : order.started;
          orderInfo.duration = order.duration ? order.duration.millis : Infinity; // Did this null value kill stuff down the line?
          orderInfo.halted = order.halted;
          orderInfo.productionFee = order.productionFee;
          orderInfo.recurring = order.recurring;

          orderInfo.inputs = [];
          order.inputs.forEach(input => {
            orderInfo.inputs.push({ MaterialTicker: input.material.ticker, Amount: input.amount });
          });

          orderInfo.outputs = [];
          order.outputs.forEach(input => {
            orderInfo.outputs.push({ MaterialTicker: input.material.ticker, Amount: input.amount });
          });

          prodLine.orders.push(orderInfo);
        });

        siteInfo.lines.push(prodLine);
      });

      if (siteInfo.lines[0]) {
        siteInfo.PlanetName = siteInfo.lines[0].PlanetName;
        siteInfo.PlanetNaturalId = siteInfo.lines[0].PlanetNaturalId;
      }

      if (matchIndex != -1) {
        result['PMMG-User-Info']['production'][matchIndex] = siteInfo;
      } else {
        result['PMMG-User-Info']['production'].push(siteInfo);
      }
      break;
    case 'COMPANY_DATA': // Company info
      result['PMMG-User-Info']['company-name'] = '';

      if (eventdata.payload.name) {
        result['PMMG-User-Info']['company-name'] = eventdata.payload.name;
      }
      if (eventdata.payload.id) {
        result['PMMG-User-Info']['company-id'] = eventdata.payload.id;
      }
      break;
    case 'ACCOUNTING_CASH_BALANCES':
      result['PMMG-User-Info']['currency'] = [];

      console.log(eventdata.payload);

      if (eventdata.payload.currencyAccounts) {
        eventdata.payload.currencyAccounts.forEach(account => {
          result['PMMG-User-Info']['currency'].push(account.currencyBalance);
        });
      }
      break;
    case 'FOREX_TRADER_ORDERS': // FX Orders
      result['PMMG-User-Info']['fxos'] = eventdata.payload.orders;
      break;
    case 'COMEX_TRADER_ORDERS': // CX Orders
      result['PMMG-User-Info']['cxos'] = eventdata.payload.orders;
      break;
    case 'COMEX_BROKER_DATA': // CXOB/CXPO Data
      result['PMMG-User-Info']['cxob'][eventdata.payload.ticker] = eventdata.payload;
      result['PMMG-User-Info']['cxob'][eventdata.payload.ticker]['timestamp'] = Date.now();

      Object.keys(result['PMMG-User-Info']['cxob']).forEach(ticker => {
        if (Date.now() - result['PMMG-User-Info']['cxob'][ticker]['timestamp'] > 900000) {
          delete result['PMMG-User-Info']['cxob'][ticker];
        }
      });
      break;
    case 'SHIP_SHIPS': // ships
      result['PMMG-User-Info']['ships'] = eventdata.payload.ships;
      break;
  }

  console.log(result);
  //console.log("Finished Logging Event, now Setting...");
  await setSettings(result);
}

// UTIL FUNCTIONS, REMOVE WHEN INTEGRATED INTO PMMG
// Set the data in local storage. Pass it the result of a getLocalStorage call
async function setSettings(result) {
  //console.log("Trying to Set Data");
  let isSet = false;
  try {
    browser.storage.local.set(result).then(function () {
      isSet = true;
    }); // For FireFox, throws an error in Chrome
  } catch (err) {
    chrome.storage.local.set(result, function () {
      // For Chrome, doesn't work in FireFox
      //console.log("PMMG: Configuration Saved.");
      isSet = true;
    });
  }

  while (!isSet) {
    await sleep(10);
  }
  return;
}

// Get the data in local storage for a given storageName. Then call the callback function.
// Also pass the params through to the callback function
async function getLocalStorage(storageName, callbackFunction, params?) {
  let isRetrieved = false;
  //console.log("Trying to Get Data");
  try {
    browser.storage.local.get(storageName).then(function (result) {
      //console.log("Successfully Got Data");
      isRetrieved = true;
      callbackFunction(result, params);
    }); // For FireFox, throws an error in Chrome
  } catch (err) {
    chrome.storage.local.get([storageName], function (result) {
      // For Chrome, doesn't work in FireFox
      isRetrieved = true;
      callbackFunction(result, params);
    });
  }

  while (!isRetrieved) {
    await sleep(10);
  }
}
