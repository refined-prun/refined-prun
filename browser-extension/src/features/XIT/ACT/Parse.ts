/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExchangeTickersReverse } from '@src/GameProperties';
import { getBuildingLastRepair, sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';
import { calculatePlanetBurn } from '@src/core/burn';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';

// Turn stored action package (resupply base for 30 days) to series of actionable actions (buy 1000 RAT, then 1000 DW, etc)
// Preview flag set to true will allow non-configured actions to be displayed
export function parseActionPackage(rawActionPackage, packageConfig, messageBox, preview?) {
  const actionPackage = [] as any;
  actionPackage.valid = false;

  // If invalid return an empty action package and throw error
  if (!rawActionPackage.global || !rawActionPackage.actions || !rawActionPackage.groups) {
    addMessage(messageBox, 'Error: Corrupted action package structure');
    return actionPackage;
  }
  let error = false;

  // Generate arrays of CX inventories so nothing is double counted later on
  const CXInvs = {};
  ['AI1', 'CI1', 'CI2', 'IC1', 'NC1', 'NC2'].forEach(ticker => {
    CXInvs[ticker] = {};
    const warehouse = warehousesStore.getByNaturalId(ExchangeTickersReverse[ticker]);
    const inv = storagesStore.getById(warehouse?.storeId);

    if (inv) {
      inv.items.forEach(mat => {
        CXInvs[ticker][mat.quantity?.material.ticker] = mat.quantity?.amount;
      });
    }
  });

  rawActionPackage.actions.forEach((action, actionIndex) => {
    if (action.type == 'CX Buy') {
      if (!action.group) {
        addMessage(messageBox, 'Error: Missing material group on CX buy');
        return actionPackage;
      }

      const groupNames = rawActionPackage.groups
        .filter(obj => obj.name !== undefined && obj.name !== '')
        .map(obj => obj.name);
      const groupIndexes = rawActionPackage.groups.reduce((acc, obj, index) => {
        if (obj.name) acc[obj.name] = index;
        return acc;
      }, {});

      if (!groupNames.includes(action.group)) {
        addMessage(messageBox, 'Error: Unrecognized material group on CX buy');
        return actionPackage;
      }
      if (!action.exchange) {
        addMessage(messageBox, 'Error: Missing exchange on CX buy');
        return actionPackage;
      }

      const group = rawActionPackage.groups[groupIndexes[action.group]];
      const errorFlag = [false];
      const parsedGroup = parseGroup(group, messageBox, errorFlag); // Parse materials needed. Object with keys equal to material tickers and values equal to number of materials

      // Take out materials in CX inventory if requested
      if (action.useCXInv) {
        Object.keys(parsedGroup).forEach(mat => {
          Object.keys(CXInvs[action.exchange]).forEach(CXMat => {
            if (CXMat == mat) {
              const used = Math.min(parsedGroup[mat], CXInvs[action.exchange][CXMat]); // Amount of material used (minimum of needed and had on hand)
              parsedGroup[mat] -= used;
              CXInvs[action.exchange][CXMat] -= used;
              if (CXInvs[action.exchange][mat] <= 0) {
                // Remove material from CX Inv is already allocated
                delete CXInvs[action.exchange][CXMat];
              }
            }
          });
          if (parsedGroup[mat] <= 0) {
            // Remove material from list if you already have enough on the CX
            delete parsedGroup[mat];
          }
        });
      }

      // Now turn into buying commands
      error = error || errorFlag[0];
      for (const mat of Object.keys(parsedGroup)) {
        const cxTicker = mat + '.' + action.exchange;
        const cxob = cxobStore.getByTicker(cxTicker);
        let amount = parsedGroup[mat];

        if (cxob && Date.now() - cxob.timestamp < 900000) {
          // Check for existance and timestamp of data
          if (cxob.sellingOrders.length == 0) {
            // No orders
            if (action.buyPartial) {
              continue; // Just ignore this one if we're fine with buying partial
            } else {
              addMessage(messageBox, 'Error: No orders on ' + cxTicker);
              error = true;
              continue;
            }
          }

          let remaining = parsedGroup[mat];
          let price;
          // Iterate through the orders to find the price to set to to buy it all
          for (const order of cxob.sellingOrders) {
            if (
              (!action.priceLimits ||
                !action.priceLimits[mat] ||
                action.priceLimits[mat] > order.limit.amount) &&
              order.amount > remaining
            ) {
              // This order will be the filling one
              price = order.limit.amount;
              break;
            } else {
              if (
                (!action.priceLimits ||
                  !action.priceLimits[mat] ||
                  action.priceLimits[mat] > order.limit.amount) &&
                order.amount
              ) {
                // Only MMs will not have an amount attached
                price = order.limit.amount;
                break;
              }
              remaining -= order.amount; // Otherwise subtract the amount of that order from the amount remaining and continue
            }
          }

          // Check against price limit
          if (
            action.priceLimits &&
            action.priceLimits[mat] &&
            price > action.priceLimits[mat] &&
            !action.buyPartial
          ) {
            addMessage(messageBox, 'Error: Price above limit on ' + cxTicker);
            error = true;
            continue;
          }
          if (action.priceLimits && action.priceLimits[mat] && isNaN(action.priceLimits[mat])) {
            addMessage(messageBox, 'Error: Non-numerical price limit on ' + cxTicker);
            error = true;
            continue;
          }

          if (!price && !action.buyPartial) {
            // Not enough to buy it all
            addMessage(messageBox, 'Error: Not enough materials on ' + cxTicker);
            error = true;
            continue;
          } else if (
            !price &&
            (!action.priceLimits || !action.priceLimits[mat]) &&
            cxob &&
            cxob.supply > 0
          ) {
            // If fine with buying partial, buy the entire stock
            price = cxob.sellingOrders[cxob.sellingOrders.length - 1].limit.amount;
            amount = cxob.supply;
          } else if (!price && action.priceLimits && action.priceLimits[mat]) {
            continue; // If there is no price, but buying partial, don't care and exit
          }

          // Now create action item
          const actionItem = {
            type: 'CXBuy',
            buffer: 'CXPO ' + cxTicker,
            parameters: {
              amount: amount,
              priceLimit: price,
            },
          };
          actionPackage.push(actionItem);
        } else {
          addMessage(messageBox, 'Error: Stale/missing data on ' + cxTicker);
          error = true;
        }
      }
    } else if (action.type == 'MTRA') {
      if (!action.group) {
        addMessage(messageBox, 'Error: Missing material group on CX buy');
        return actionPackage;
      }

      const groupNames = rawActionPackage.groups
        .filter(obj => obj.name !== undefined && obj.name !== '')
        .map(obj => obj.name);
      const groupIndexes = rawActionPackage.groups.reduce((acc, obj, index) => {
        if (obj.name) acc[obj.name] = index;
        return acc;
      }, {});

      if (!groupNames.includes(action.group)) {
        addMessage(messageBox, 'Error: Unrecognized material group on MTRA');
        return actionPackage;
      }
      if (!action.origin) {
        addMessage(messageBox, 'Error: Missing origin on MTRA');
        return actionPackage;
      }
      if (!action.dest) {
        addMessage(messageBox, 'Error: Missing dest on MTRA');
        return actionPackage;
      }

      // Check configuration
      if (
        !preview &&
        action.origin == 'Configure on Execution' &&
        (!packageConfig.actions[actionIndex] || !packageConfig.actions[actionIndex].origin)
      ) {
        addMessage(messageBox, 'Error: Missing origin configuration on MTRA');
        return actionPackage;
      }
      if (
        !preview &&
        action.dest == 'Configure on Execution' &&
        (!packageConfig.actions[actionIndex] || !packageConfig.actions[actionIndex].dest)
      ) {
        addMessage(messageBox, 'Error: Missing destination configuration on MTRA');
        return actionPackage;
      }

      // Set configuration
      const origin =
        action.origin == 'Configure on Execution' &&
        packageConfig.actions[actionIndex] &&
        packageConfig.actions[actionIndex].origin
          ? packageConfig.actions[actionIndex].origin
          : action.origin;
      const dest =
        action.dest == 'Configure on Execution' &&
        packageConfig.actions[actionIndex] &&
        packageConfig.actions[actionIndex].dest
          ? packageConfig.actions[actionIndex].dest
          : action.dest;

      const group = rawActionPackage.groups[groupIndexes[action.group]];
      const errorFlag = [false];
      const parsedGroup = parseGroup(group, messageBox, errorFlag); // Parse materials needed. Object with keys equal to material tickers and values equal to number of materials

      Object.keys(parsedGroup).forEach(mat => {
        // MAT change action action
        const changeAction = {
          type: 'mtraMatSelect',
          buffer: 'MTRA',
          parameters: {
            origin: origin,
            dest: dest,
            ticker: mat,
            amount: parsedGroup[mat],
          },
        };
        // Now create action item
        const actionItem = {
          type: 'MTRA',
          buffer: 'MTRA',
          parameters: {
            origin: origin,
            dest: dest,
            ticker: mat,
            amount: parsedGroup[mat],
          },
        };
        actionPackage.push(changeAction);
        actionPackage.push(actionItem);
      });
    } else {
      addMessage(messageBox, 'Error: Unrecognized action type');
      error = true;
    }
  });

  actionPackage.valid = !error;
  return actionPackage;
}

// Parse a material group into a list of materials
export function parseGroup(group, messageBox, errorFlag) {
  let parsedGroup = {};
  if (group.type == 'Resupply') {
    // Interpret burn to get number of materials
    if (!group.planet) {
      addMessage(messageBox, 'Error: Missing resupply planet');
      errorFlag[0] = true;
      return parsedGroup;
    }
    if (!group.days) {
      addMessage(messageBox, 'Error: Missing resupply days');
      errorFlag[0] = true;
      return parsedGroup;
    }

    // Array of tickers to exclude
    const exclusions = group.exclusions || [];
    const site = sitesStore.getByPlanetNaturalIdOrName(group.planet);
    const workforce = workforcesStore.getById(site?.siteId)?.workforces;
    const production = productionStore.getBySiteId(site?.siteId);
    const stores = storagesStore.getByAddress(site?.siteId);

    if (workforce) {
      const planetBurn = calculatePlanetBurn(production, workforce, stores); // The planet burn data

      Object.keys(planetBurn).forEach(mat => {
        if (planetBurn[mat].DailyAmount < 0) {
          // Consuming not producing
          let amount = Math.ceil(-planetBurn[mat].DailyAmount * group.days); // Calculate amount
          if (group.useBaseInv) {
            // Take out base inventory if we're doing that
            amount -= planetBurn[mat].Inventory;
          }

          if (amount > 0) {
            // If we still need that material...
            // Check material Exclusions
            if (!exclusions.includes(mat)) {
              parsedGroup[mat] = amount; // Assign it to the parsed material group
            }
          }
        }
      });
    } else {
      addMessage(messageBox, 'Error: Missing burn data');
      errorFlag[0] = true;
      return parsedGroup;
    }
  } else if (group.type == 'Repair') {
    if (!group.planet) {
      addMessage(messageBox, 'Error: Missing resupply planet');
      errorFlag[0] = true;
      return parsedGroup;
    }
    const threshold = isNaN(parseFloat(group.days)) ? 0 : parseFloat(group.days); // The threshold to start repairing buildings [days]
    const advanceDays = isNaN(parseFloat(group.advanceDays)) ? 0 : parseFloat(group.advanceDays); // The number of days forward looking

    const planetSite = sitesStore.getByPlanetNaturalIdOrName(group.planet);

    if (planetSite && planetSite.platforms) {
      planetSite.platforms.forEach(building => {
        if (building.repairMaterials.length === 0) {
          return;
        }

        const lastRepair = getBuildingLastRepair(building);
        const date = (new Date().getTime() - lastRepair) / 86400000;

        if (date + advanceDays < threshold) {
          return;
        } // Parse out too new of buildings

        // Calculate total building cost
        const buildingMaterials = {};
        building.reclaimableMaterials.forEach(mat => {
          const amount = mat.amount;
          const ticker = mat.material.ticker;
          if (buildingMaterials[ticker]) {
            buildingMaterials[ticker] += amount;
          } else {
            buildingMaterials[ticker] = amount;
          }
        });
        building.repairMaterials.forEach(mat => {
          const amount = mat.amount;
          const ticker = mat.material.ticker;
          if (buildingMaterials[ticker]) {
            buildingMaterials[ticker] += amount;
          } else {
            buildingMaterials[ticker] = amount;
          }
        });

        const adjustedDate = date + advanceDays;
        Object.keys(buildingMaterials).forEach(ticker => {
          const amount =
            adjustedDate > 180
              ? buildingMaterials[ticker]
              : Math.ceil((buildingMaterials[ticker] * adjustedDate) / 180); // This isn't quite right, but will be off by only 1 MCG at most

          if (parsedGroup[ticker]) {
            parsedGroup[ticker] += amount;
          } else {
            parsedGroup[ticker] = amount;
          }
        });
      });
    } else {
      addMessage(messageBox, 'Error: Missing data on repair planet');
      errorFlag[0] = true;
    }
  } else if (group.type == 'Manual') {
    // Just return the list of materials
    if (group.materials) {
      parsedGroup = group.materials;
    } else {
      addMessage(messageBox, 'Error: Missing materials in manual group');
      errorFlag[0] = true;
    }
  } else {
    addMessage(messageBox, 'Error: Unrecognized group type');
  }

  return parsedGroup;
}

function addMessage(messageBox, message, clear?) {
  messageBox.textContent = clear
    ? message
    : message + (messageBox.textContent == '' ? '' : '\n') + messageBox.textContent;
}
