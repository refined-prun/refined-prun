import { ExchangeTickersReverse } from '@src/legacy';
import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { addMessage } from './Execute';
import { clamp } from '@src/utils/clamp';
import { fixed0 } from '@src/utils/format';
import { act } from '@src/features/XIT/ACT/act-registry';

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
        const priceLimit = action.priceLimits?.[mat] ?? Infinity;
        if (isNaN(priceLimit)) {
          addMessage(messageBox, 'Non-numerical price limit on ' + cxTicker, 'ERROR');
          error = true;
          continue;
        }

        const orderBook = cxobStore.getByTicker(cxTicker);

        if (!orderBook) {
          addMessage(messageBox, 'Missing data on ' + cxTicker, 'ERROR');
          error = true;
          continue;
        }

        const requiredAmount = parsedGroup[mat];
        let filled = 0;
        let price = 0;
        for (const order of orderBook.sellingOrders) {
          const orderPrice = order.limit.amount;
          if (priceLimit < orderPrice) {
            break;
          }
          price = orderPrice;
          // MMs orders don't have the amount
          if (!order.amount) {
            filled = requiredAmount;
            break;
          }
          filled = clamp(filled + order.amount, 0, requiredAmount);
          if (filled === requiredAmount) {
            break;
          }
        }

        if (filled === 0 && action.buyPartial) {
          // No matching orders
          // Just ignore this one if we're fine with buying partial
          continue;
        }

        if (filled < requiredAmount) {
          // Not enough to buy it all
          if (!action.buyPartial) {
            const message = isFinite(priceLimit)
              ? `Not enough materials on ${cxTicker} to buy ${fixed0(requiredAmount)} ${mat} with the provided price limit ${fixed0(priceLimit)}/u`
              : `Not enough materials on ${cxTicker} to buy ${fixed0(requiredAmount)} ${mat}`;
            addMessage(messageBox, message, 'ERROR');
            error = true;
            continue;
          }
        }

        // Now create action item
        const actionItem = {
          type: 'CXBuy',
          buffer: 'CXPO ' + cxTicker,
          parameters: {
            amount: filled,
            priceLimit: price,
          },
        };
        actionPackage.push(actionItem);
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
export function parseGroup(group: UserData.MaterialGroupData, messageBox, errorFlag) {
  const info = act.getMaterialGroupInfo(group.type);
  if (!info) {
    addMessage(messageBox, 'Unrecognized material group type', 'ERROR');
    errorFlag[0] = true;
    return {};
  }
  const result = info.generateMaterialBill(group);
  if (typeof result === 'string') {
    addMessage(messageBox, result, 'ERROR');
    errorFlag[0] = true;
    return {};
  }
  return result;
}
