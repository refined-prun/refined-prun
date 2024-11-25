import { ExchangeTickersReverse } from '@src/legacy';
import { getBuildingLastRepair, sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';
import { calculatePlanetBurn } from '@src/core/burn';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { addMessage } from './Execute';
import { isRepairableBuilding } from '@src/core/buildings';

// Turn stored action package (resupply base for 30 days) to series of actionable actions (buy 1000 RAT, then 1000 DW, etc)
// Preview flag set to true will allow non-configured actions to be displayed
export function parseActionPackage(
  rawActionPackage: UserData.ActionPackageData,
  packageConfig,
  messageBox,
  preview?,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actionPackage = [] as any;
  actionPackage.valid = false;

  // If invalid return an empty action package and throw error
  if (!rawActionPackage.global.name || !rawActionPackage.actions || !rawActionPackage.groups) {
    addMessage(messageBox, 'Corrupted action package structure', 'ERROR');
    return actionPackage;
  }
  let error = false;

  // Generate arrays of CX inventories so nothing is double counted later on
  const CXInvs = {};
  for (const ticker of ['AI1', 'CI1', 'CI2', 'IC1', 'NC1', 'NC2']) {
    CXInvs[ticker] = {};
    const warehouse = warehousesStore.getByEntityNaturalId(ExchangeTickersReverse[ticker]);
    const inv = storagesStore.getById(warehouse?.storeId);

    if (inv) {
      for (const mat of inv.items) {
        CXInvs[ticker][mat.quantity?.material.ticker] = mat.quantity?.amount;
      }
    }
  }

  for (let i = 0; i < rawActionPackage.actions.length; i++) {
    const action = rawActionPackage.actions[i];
    const actionIndex = i;
    if (action.type == 'CX Buy') {
      if (!action.group) {
        addMessage(messageBox, 'Missing material group on CX buy', 'ERROR');
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
        addMessage(messageBox, 'Unrecognized material group on CX buy', 'ERROR');
      }
      if (!action.exchange) {
        addMessage(messageBox, 'Missing exchange on CX buy', 'ERROR');
      }

      const group = rawActionPackage.groups[groupIndexes[action.group]];
      const errorFlag = [false];
      const parsedGroup = parseGroup(group, messageBox, errorFlag); // Parse materials needed. Object with keys equal to material tickers and values equal to number of materials

      // Take out materials in CX inventory if requested
      if (action.useCXInv && action.exchange) {
        for (const mat of Object.keys(parsedGroup)) {
          for (const CXMat of Object.keys(CXInvs[action.exchange])) {
            if (CXMat == mat) {
              const used = Math.min(parsedGroup[mat], CXInvs[action.exchange][CXMat]); // Amount of material used (minimum of needed and had on hand)
              parsedGroup[mat] -= used;
              CXInvs[action.exchange][CXMat] -= used;
              if (CXInvs[action.exchange][mat] <= 0) {
                // Remove material from CX Inv is already allocated
                delete CXInvs[action.exchange][CXMat];
              }
            }
          }
          if (parsedGroup[mat] <= 0) {
            // Remove material from list if you already have enough on the CX
            delete parsedGroup[mat];
          }
        }
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
              addMessage(messageBox, 'No orders on ' + cxTicker, 'ERROR');
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
            addMessage(messageBox, 'Price above limit on ' + cxTicker, 'ERROR');
            error = true;
            continue;
          }
          if (action.priceLimits && action.priceLimits[mat] && isNaN(action.priceLimits[mat])) {
            addMessage(messageBox, 'Non-numerical price limit on ' + cxTicker, 'ERROR');
            error = true;
            continue;
          }

          if (!price && !action.buyPartial) {
            // Not enough to buy it all
            addMessage(messageBox, 'Not enough materials on ' + cxTicker, 'ERROR');
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
          addMessage(messageBox, 'Stale/missing data on ' + cxTicker, 'ERROR');
          error = true;
        }
      }
    } else if (action.type == 'MTRA') {
      if (!action.group) {
        addMessage(messageBox, 'Missing material group on CX buy', 'ERROR');
      }

      const groupNames = rawActionPackage.groups
        .filter(obj => obj.name !== undefined && obj.name !== '')
        .map(obj => obj.name);
      const groupIndexes = rawActionPackage.groups.reduce((acc, obj, index) => {
        if (obj.name) acc[obj.name] = index;
        return acc;
      }, {});

      if (!groupNames.includes(action.group)) {
        addMessage(messageBox, 'Unrecognized material group on MTRA', 'ERROR');
      }
      if (!action.origin) {
        addMessage(messageBox, 'Missing origin on MTRA', 'ERROR');
      }
      if (!action.dest) {
        addMessage(messageBox, 'Missing dest on MTRA', 'ERROR');
      }

      // Check configuration
      if (
        !preview &&
        action.origin == 'Configure on Execution' &&
        (!packageConfig.actions[actionIndex] || !packageConfig.actions[actionIndex].origin)
      ) {
        addMessage(messageBox, 'Missing origin configuration on MTRA', 'ERROR');
      }
      if (
        !preview &&
        action.dest == 'Configure on Execution' &&
        (!packageConfig.actions[actionIndex] || !packageConfig.actions[actionIndex].dest)
      ) {
        addMessage(messageBox, 'Missing destination configuration on MTRA', 'ERROR');
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

      const group = rawActionPackage.groups[groupIndexes[action.group!]];
      const errorFlag = [false];
      const parsedGroup = parseGroup(group, messageBox, errorFlag); // Parse materials needed. Object with keys equal to material tickers and values equal to number of materials

      for (const mat of Object.keys(parsedGroup)) {
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
      }
    } else {
      addMessage(messageBox, 'Unrecognized action type', 'ERROR');
      error = true;
    }
  }

  actionPackage.valid = !error;
  return actionPackage;
}

// Parse a material group into a list of materials
export function parseGroup(group: UserData.ActionGroupData, messageBox, errorFlag) {
  let parsedGroup = {};
  if (group.type == 'Resupply') {
    // Interpret burn to get number of materials
    if (!group.planet) {
      addMessage(messageBox, 'Missing resupply planet', 'ERROR');
      errorFlag[0] = true;
      return parsedGroup;
    }
    if (!group.days) {
      addMessage(messageBox, 'Missing resupply days', 'ERROR');
      errorFlag[0] = true;
      return parsedGroup;
    }

    // Array of tickers to exclude
    const exclusions = group.exclusions || [];
    const site = sitesStore.getByPlanetNaturalIdOrName(group.planet);
    const workforce = workforcesStore.getById(site?.siteId)?.workforces;
    const production = group.consumablesOnly
      ? undefined
      : productionStore.getBySiteId(site?.siteId);
    const stores = storagesStore.getByAddressableId(site?.siteId);

    if (workforce) {
      const planetBurn = calculatePlanetBurn(production, workforce, stores); // The planet burn data

      for (const mat of Object.keys(planetBurn)) {
        if (planetBurn[mat].DailyAmount < 0) {
          // Consuming not producing
          const days = typeof group.days === 'number' ? group.days : parseFloat(group.days);
          let amount = Math.ceil(-planetBurn[mat].DailyAmount * days); // Calculate amount
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
      }
    } else {
      addMessage(messageBox, 'Missing burn data', 'ERROR');
      errorFlag[0] = true;
      return parsedGroup;
    }
  } else if (group.type == 'Repair') {
    if (!group.planet) {
      addMessage(messageBox, 'Missing resupply planet', 'ERROR');
      errorFlag[0] = true;
      return parsedGroup;
    }
    const days = typeof group.days === 'number' ? group.days : parseFloat(group.days!);
    let advanceDays =
      typeof group.advanceDays === 'number' ? group.advanceDays : parseFloat(group.advanceDays!);
    const threshold = isNaN(days) ? 0 : days; // The threshold to start repairing buildings [days]
    advanceDays = isNaN(advanceDays) ? 0 : advanceDays; // The number of days forward looking

    const planetSite = sitesStore.getByPlanetNaturalIdOrName(group.planet);

    if (planetSite && planetSite.platforms) {
      for (const building of planetSite.platforms) {
        if (!isRepairableBuilding(building)) {
          continue;
        }

        const lastRepair = getBuildingLastRepair(building);
        const date = (new Date().getTime() - lastRepair) / 86400000;

        if (date + advanceDays < threshold) {
          continue;
        } // Parse out too new of buildings

        // Calculate total building cost
        const buildingMaterials = {};
        for (const mat of building.reclaimableMaterials) {
          const amount = mat.amount;
          const ticker = mat.material.ticker;
          if (buildingMaterials[ticker]) {
            buildingMaterials[ticker] += amount;
          } else {
            buildingMaterials[ticker] = amount;
          }
        }
        for (const mat of building.repairMaterials) {
          const amount = mat.amount;
          const ticker = mat.material.ticker;
          if (buildingMaterials[ticker]) {
            buildingMaterials[ticker] += amount;
          } else {
            buildingMaterials[ticker] = amount;
          }
        }

        const adjustedDate = date + advanceDays;
        for (const ticker of Object.keys(buildingMaterials)) {
          const amount =
            adjustedDate > 180
              ? buildingMaterials[ticker]
              : Math.ceil((buildingMaterials[ticker] * adjustedDate) / 180); // This isn't quite right, but will be off by only 1 MCG at most

          if (parsedGroup[ticker]) {
            parsedGroup[ticker] += amount;
          } else {
            parsedGroup[ticker] = amount;
          }
        }
      }
    } else {
      addMessage(messageBox, 'Missing data on repair planet', 'ERROR');
      errorFlag[0] = true;
    }
  } else if (group.type == 'Manual') {
    // Just return the list of materials
    if (group.materials) {
      parsedGroup = group.materials;
    } else {
      addMessage(messageBox, 'Missing materials in manual group', 'ERROR');
      errorFlag[0] = true;
    }
  } else {
    addMessage(messageBox, 'Unrecognized group type', 'ERROR');
  }

  return parsedGroup;
}
