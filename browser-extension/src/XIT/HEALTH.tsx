import { clearChildren, createTable, createTextSpan } from '../util';
import { TextColors } from '../Style';
import user from '@src/store/user';
import xit from './xit-registry';
import cx from '@src/fio/cx';
import features from '@src/feature-registry';
import { store } from '@src/prun-api/data/store';
import { selectContractsTotal } from '@src/prun-api/data/contracts';
import { selectCxosTotal } from '@src/prun-api/data/cxos';
import { selectFxosTotal } from '@src/prun-api/data/fxos';

class DataHealth {
  private tile: HTMLElement;
  public parameters: string[];
  public pmmgSettings;
  public name = 'DATA HEALTH';

  constructor(tile, parameters, pmmgSettings) {
    this.tile = tile;
    this.parameters = parameters;
    this.pmmgSettings = pmmgSettings;
  }

  create_buffer() {
    clearChildren(this.tile);

    const storeState = store.getState();

    // Construct table for health of base data
    const baseTitle = createTextSpan('Bases');
    baseTitle.classList.add('title');
    this.tile.appendChild(baseTitle);

    const baseBody = createTable(this.tile, ['Planet', 'Workforce', 'Production', 'Storage']);
    const baseInfo = {};

    for (const site of user.sites.filter(x => x.type === 'BASE')) {
      if (site.PlanetName) {
        baseInfo[site.PlanetName] = [false, false, false];
      }
    }

    for (const workforce of user.workforce) {
      if (workforce.PlanetName && !baseInfo[workforce.PlanetName]) {
        baseInfo[workforce.PlanetName] = [true, false, false];
      } else if (workforce.PlanetName) {
        baseInfo[workforce.PlanetName][0] = true;
      }
    }

    for (const production of user.production) {
      if (production.PlanetName && !baseInfo[production.PlanetName]) {
        baseInfo[production.PlanetName] = [false, true, false];
      } else if (production.PlanetName) {
        baseInfo[production.PlanetName][1] = true;
      }
    }

    for (const storage of user.storage) {
      if (storage.PlanetName && storage.type == 'STORE' && !baseInfo[storage.PlanetName]) {
        baseInfo[storage.PlanetName] = [false, false, true];
      } else if (storage.PlanetName && storage.type == 'STORE') {
        baseInfo[storage.PlanetName][2] = true;
      }
    }

    Object.keys(baseInfo).forEach(planet => {
      const row = document.createElement('tr');
      baseBody.appendChild(row);

      const planetElem = document.createElement('td');
      planetElem.appendChild(createTextSpan(planet));
      row.appendChild(planetElem);

      baseInfo[planet].forEach(present => {
        const textElem = document.createElement('td');
        textElem.appendChild(createTextSpan(present ? '✓' : 'X'));
        textElem.style.color = present ? TextColors.Success : TextColors.Failure;
        row.appendChild(textElem);
      });
    });

    // Create table for health of other parts
    const otherTitle = createTextSpan('Other Data');
    otherTitle.classList.add('title');
    otherTitle.style.paddingTop = '10px';
    this.tile.appendChild(otherTitle);
    const otherTable = createTable(this.tile, ['Parameter', 'Value']);

    const numBaseSites = user.sites.filter(item => item.type === 'BASE').length;
    otherTable.appendChild(createTableRow('Base Sites', numBaseSites));

    const numWarehouseSites = user.sites.filter(item => item.type !== 'BASE').length;
    otherTable.appendChild(createTableRow('Warehouse Sites', numWarehouseSites));

    const numBaseStores = user.storage.filter(item => item.type === 'STORE').length;
    otherTable.appendChild(createTableRow('Base Stores', numBaseStores));

    const numWarehouseStores = user.storage.filter(item => item.type === 'WAREHOUSE_STORE').length;
    otherTable.appendChild(createTableRow('Warehouse Stores', numWarehouseStores));

    const numShipStores = user.storage.filter(item => item.type === 'SHIP_STORE').length;
    otherTable.appendChild(createTableRow('Ship Stores', numShipStores));

    const numWorkforces = user.workforce.length;
    otherTable.appendChild(createTableRow('Workforces', numWorkforces));

    const numProduction = user.production.length;
    otherTable.appendChild(createTableRow('Production Sites', numProduction));

    const contracts = selectContractsTotal(storeState);
    otherTable.appendChild(createTableRow('Contracts', contracts));

    const cxos = selectCxosTotal(storeState);
    otherTable.appendChild(createTableRow('CXOS', cxos));

    const fxos = selectFxosTotal(storeState);
    otherTable.appendChild(createTableRow('FXOS', fxos));

    otherTable.appendChild(createTableRow('Currency', user.currency.length > 0));

    const cxPriceAge = cx.prices
      ? `${((Date.now() - cx.prices.Age) / 3600000).toFixed(0)}h`
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (false as any);
    otherTable.appendChild(createTableRow('CX Price Age', cxPriceAge));
  }

  update_buffer() {
    // Nothing to update
  }

  destroy_buffer() {
    // Nothing constantly running so nothing to destroy
  }
}

// Creates a table row for a 2 column table. If value is true or false it shows as a colored check or x.
function createTableRow(parameter, value) {
  const row = document.createElement('tr');
  const paramElem = document.createElement('td');
  paramElem.appendChild(createTextSpan(parameter));
  row.appendChild(paramElem);

  const valueElem = document.createElement('td');
  if (value === true) {
    valueElem.appendChild(createTextSpan('✓'));
    valueElem.style.color = TextColors.Success;
  } else if (value === false) {
    valueElem.appendChild(createTextSpan('X'));
    valueElem.style.color = TextColors.Failure;
  } else {
    valueElem.appendChild(createTextSpan(value));
  }
  row.appendChild(valueElem);

  return row;
}

function init() {
  xit.add({
    command: 'HEALTH',
    name: 'DATA HEALTH',
    module: DataHealth,
  });
}

features.add({
  id: 'xit-health',
  init,
});
