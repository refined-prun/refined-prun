import { clearChildren, createTable, createTextSpan } from '../util';
import { TextColors } from '../Style';
import xit from './xit-registry';
import cx from '@src/fio/cx';
import features from '@src/feature-registry';
import { contractsStore } from '@src/prun-api/data/contracts';
import { cxosStore } from '@src/prun-api/data/cxos';
import { fxosStore } from '@src/prun-api/data/fxos';
import { balancesStore } from '@src/prun-api/data/balances';
import { sitesStore } from '@src/prun-api/data/sites';
import { getPlanetNameFromAddress } from '@src/prun-api/data/addresses';
import { workforcesStore } from '@src/prun-api/data/workforces';
import { productionStore } from '@src/prun-api/data/production';
import { storagesStore } from '@src/prun-api/data/storage';
import { warehousesStore } from '@src/prun-api/data/warehouses';

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

    // Construct table for health of base data
    const baseTitle = createTextSpan('Bases');
    baseTitle.classList.add('title');
    this.tile.appendChild(baseTitle);

    const baseBody = createTable(this.tile, ['Planet', 'Workforce', 'Production', 'Storage']);
    const baseInfo = {};

    for (const site of sitesStore.all.value) {
      const name = getPlanetNameFromAddress(site.address)!;
      baseInfo[name] = [
        workforcesStore.getById(site.siteId),
        productionStore.getBySiteId(site.siteId),
        storagesStore.getByAddress(site.siteId),
      ];
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

    const numBaseSites = sitesStore.all.value.length;
    otherTable.appendChild(createTableRow('Base Sites', numBaseSites));

    const numWarehouseSites = warehousesStore.all.value.length;
    otherTable.appendChild(createTableRow('Warehouse Sites', numWarehouseSites));

    const numBaseStores = storagesStore.all.value.filter(x => x.type === 'STORE').length;
    otherTable.appendChild(createTableRow('Base Stores', numBaseStores));

    const numWarehouseStores = storagesStore.all.value.filter(
      x => x.type === 'WAREHOUSE_STORE',
    ).length;
    otherTable.appendChild(createTableRow('Warehouse Stores', numWarehouseStores));

    const numShipStores = storagesStore.all.value.filter(x => x.type === 'SHIP_STORE').length;
    otherTable.appendChild(createTableRow('Ship Stores', numShipStores));

    const numWorkforces = workforcesStore.all.value.length;
    otherTable.appendChild(createTableRow('Workforces', numWorkforces));

    const numProduction = productionStore.all.value.length;
    otherTable.appendChild(createTableRow('Production Sites', numProduction));

    const contracts = contractsStore.all.value.length;
    otherTable.appendChild(createTableRow('Contracts', contracts));

    const cxos = cxosStore.all.value.length;
    otherTable.appendChild(createTableRow('CXOS', cxos));

    const fxos = fxosStore.all.value.length;
    otherTable.appendChild(createTableRow('FXOS', fxos));

    otherTable.appendChild(createTableRow('Currency', balancesStore.all.value.length > 0));

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
