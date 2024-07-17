import { clearChildren, createTextSpan, createTable } from '../util';
import { TextColors, Style } from '../Style';
import { userData } from '@src/prun-api/user-data';
import { system } from '@src/system';

export class DataHealth {
  private tile: HTMLElement;
  public parameters: string[];
  public pmmgSettings;
  private userInfo;
  public name = 'DATA HEALTH';

  constructor(tile, parameters, pmmgSettings, userInfo) {
    this.tile = tile;
    this.parameters = parameters;
    this.pmmgSettings = pmmgSettings;
    this.userInfo = userInfo;
  }

  create_buffer() {
    clearChildren(this.tile);

    // Construct table for health of base data
    const baseTitle = createTextSpan('Bases');
    baseTitle.classList.add('title');
    this.tile.appendChild(baseTitle);

    const baseBody = createTable(this.tile, ['Planet', 'Workforce', 'Production', 'Storage']);
    const baseInfo = {};

    if (!this.userInfo['PMMG-User-Info']) {
      // This should almost never happen.
      this.tile.appendChild(
        createTextSpan(
          'No collected data is present. Refresh the buffer. If the problem persists, contact Pi314 on Discord.',
        ),
      );
      return;
    }

    (this.userInfo['PMMG-User-Info']['workforce'] || []).forEach(workforce => {
      if (workforce.PlanetName && !baseInfo[workforce.PlanetName]) {
        baseInfo[workforce.PlanetName] = [true, false, false];
      }
    });

    (this.userInfo['PMMG-User-Info']['production'] || []).forEach(production => {
      if (production.PlanetName && !baseInfo[production.PlanetName]) {
        baseInfo[production.PlanetName] = [false, true, false];
      } else if (production.PlanetName) {
        baseInfo[production.PlanetName][1] = true;
      }
    });

    (this.userInfo['PMMG-User-Info']['storage'] || []).forEach(storage => {
      if (storage.PlanetName && storage.type == 'STORE' && !baseInfo[storage.PlanetName]) {
        baseInfo[storage.PlanetName] = [false, false, true];
      } else if (storage.PlanetName && storage.type == 'STORE') {
        baseInfo[storage.PlanetName][2] = true;
      }
    });

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

    const numBaseSites = (this.userInfo['PMMG-User-Info']['sites'] || []).filter(item => item.type === 'BASE').length;
    otherTable.appendChild(createTableRow('Base Sites', numBaseSites));

    const numWarehouseSites = (this.userInfo['PMMG-User-Info']['sites'] || []).filter(
      item => item.type !== 'BASE',
    ).length;
    otherTable.appendChild(createTableRow('Warehouse Sites', numWarehouseSites));

    const numBaseStores = (this.userInfo['PMMG-User-Info']['storage'] || []).filter(
      item => item.type === 'STORE',
    ).length;
    otherTable.appendChild(createTableRow('Base Stores', numBaseStores));

    const numWarehouseStores = (this.userInfo['PMMG-User-Info']['storage'] || []).filter(
      item => item.type === 'WAREHOUSE_STORE',
    ).length;
    otherTable.appendChild(createTableRow('Warehouse Stores', numWarehouseStores));

    const numShipStores = (this.userInfo['PMMG-User-Info']['storage'] || []).filter(
      item => item.type === 'SHIP_STORE',
    ).length;
    otherTable.appendChild(createTableRow('Ship Stores', numShipStores));

    const numWorkforces = (this.userInfo['PMMG-User-Info']['workforce'] || []).length;
    otherTable.appendChild(createTableRow('Workforces', numWorkforces));

    const numProduction = (this.userInfo['PMMG-User-Info']['production'] || []).length;
    otherTable.appendChild(createTableRow('Production Sites', numProduction));

    const contracts = (this.userInfo['PMMG-User-Info']['contracts'] || []).length;
    otherTable.appendChild(createTableRow('Contracts', contracts));

    const cxos = (this.userInfo['PMMG-User-Info']['cxos'] || []).length;
    otherTable.appendChild(createTableRow('CXOS', cxos));

    const fxos = userData.fxos.length;
    otherTable.appendChild(createTableRow('FXOS', fxos));

    otherTable.appendChild(
      createTableRow(
        'Currency',
        this.userInfo['PMMG-User-Info']['currency'] && this.userInfo['PMMG-User-Info']['currency'][0] != undefined,
      ),
    );

    const cxPriceAge = this.userInfo['PMMG-User-Info']['cx_prices']
      ? ((Date.now() - this.userInfo['PMMG-User-Info']['cx_prices']['Age']) / 3600000).toLocaleString(undefined, {
          maximumFractionDigits: 0,
        }) + 'h'
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (false as any);
    otherTable.appendChild(createTableRow('CX Price Age', cxPriceAge));

    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear User Data';
    clearButton.classList.add(...Style.Button);
    clearButton.classList.add(...Style.ButtonPrimary);
    clearButton.style.margin = '4px';
    clearButton.style.display = 'block';
    clearButton.addEventListener('click', function () {
      system.storage.local.remove('PMMG-User-Info');
    });
    this.tile.appendChild(clearButton);
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
