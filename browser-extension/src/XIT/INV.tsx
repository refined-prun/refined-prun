import { clearChildren, createTextSpan, createMaterialElement, createLink, XITWebRequest, materialSort } from '../util';
import xit from './xit-registry';
import { createXitAdapter } from '@src/XIT/LegacyXitAdapter';

export class FIOInventory {
  private tile: HTMLElement;
  private parameters: string[];
  private pmmgSettings;
  public name = 'FIO INVENTORY';

  constructor(tile, parameters, pmmgSettings) {
    this.tile = tile;
    this.parameters = parameters;
    this.pmmgSettings = pmmgSettings;
  }

  create_buffer() {
    clearChildren(this.tile);
    const apikey = this.pmmgSettings['PMMGExtended']['apikey'];
    if (this.parameters.length < 2) {
      this.tile.textContent = 'Error! Not Enough Parameters!';
      return;
    }

    if (this.parameters.length == 2) {
      this.parameters.push(apikey);
      XITWebRequest(
        this.tile,
        this.parameters,
        FIOInv_getAllStorages,
        `https://rest.fnar.net/auth/group/${this.parameters[1]}`,
        'GET',
        ['Authorization', apikey],
        undefined,
      );
    } else {
      for (
        let i = 3;
        i < this.parameters.length;
        i++ // Allow for spaces in planet names
      ) {
        this.parameters[2] += ` ${this.parameters[i]}`;
      }

      XITWebRequest(
        this.tile,
        this.parameters,
        FIOInv_post,
        `https://rest.fnar.net/storage/${this.parameters[1]}/${this.parameters[2]}`,
        'GET',
        ['Authorization', apikey],
        undefined,
      );
    }
    return;
  }

  update_buffer() {
    // Nothing to update
  }

  destroy_buffer() {
    // Nothing constantly running so nothing to destroy
  }
}

function FIOInv_post(tile, parameters, jsondata) {
  const tag = 'FIO';
  if (jsondata == undefined || jsondata == null) {
    return;
  }
  let inventoryData;
  try {
    inventoryData = JSON.parse(jsondata);
  } catch (SyntaxError) {
    tile.textContent = 'Error! Could Not Load Data!';
    return;
  }
  if (!inventoryData) {
    return;
  }
  const volumeUsed = inventoryData['VolumeLoad'];
  const volumeTotal = inventoryData['VolumeCapacity'];
  const weightUsed = inventoryData['WeightLoad'];
  const weightTotal = inventoryData['WeightCapacity'];

  const header = document.createElement('div');
  header.classList.add('inv-header');
  header.id = 'header';
  header.classList.add(tag);

  tile.appendChild(header);
  const body = document.createElement('div');
  tile.appendChild(body);
  body.classList.add(tag);
  body.classList.add('inv-body');
  body.id = 'body';

  header.appendChild(createTextSpan(parameters[2], tag));
  header.appendChild(document.createElement('br'));
  const userElem = createTextSpan(parameters[1], tag);
  userElem.style.paddingLeft = '8px';
  header.appendChild(userElem);

  const volumeLine = document.createElement('div');
  volumeLine.id = 'volume-line';
  volumeLine.style.padding = '2px 8px';
  volumeLine.style.color = '#999999';
  volumeLine.appendChild(createTextSpan('Volume ', tag));
  const volumeBar = document.createElement('progress');
  volumeBar.id = 'volume-bar';
  volumeBar.classList.add(tag);
  volumeBar.classList.add('progress-bar');
  volumeBar.max = 1;
  volumeBar.value = volumeUsed / volumeTotal;
  volumeLine.appendChild(volumeBar);
  volumeLine.appendChild(
    createTextSpan(
      `${volumeUsed.toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      })} / ${volumeTotal.toLocaleString(undefined, {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      })} m³`,
      tag,
    ),
  );

  header.appendChild(volumeLine);

  const weightLine = document.createElement('div');
  weightLine.id = 'weight-line';
  weightLine.style.padding = '2px 8px';
  weightLine.style.color = '#999999';
  weightLine.appendChild(createTextSpan('Weight ', tag));
  const weightBar = document.createElement('progress');
  weightBar.id = 'weight-bar';
  weightBar.classList.add(tag);
  weightBar.classList.add('progress-bar');
  weightBar.max = 1;
  weightBar.value = weightUsed / weightTotal;
  weightLine.appendChild(weightBar);
  weightLine.appendChild(
    createTextSpan(
      `${weightUsed.toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      })} / ${weightTotal.toLocaleString(undefined, {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      })} t`,
      tag,
    ),
  );

  header.appendChild(weightLine);
  inventoryData['StorageItems'].sort(fioMatsAlphabetSort);
  for (const item of inventoryData['StorageItems']) {
    const mat = createMaterialElement(item['MaterialTicker'], tag, item['MaterialAmount'], true);
    if (mat) {
      body.appendChild(mat);
    }
  }
  return;
}

function FIOInv_getAllStorages(tile, parameters, jsondata) {
  let userJSON;
  try {
    userJSON = JSON.parse(jsondata);
  } catch (SyntaxError) {
    tile.textContent = 'Error! Bad Data from FIO!';
  }
  const usernames = [] as string[];
  userJSON['GroupUsers'].forEach(user => {
    usernames.push(user['GroupUserName']);
    return;
  });

  parameters.push(userJSON['GroupName']);

  XITWebRequest(
    tile,
    parameters,
    FIOInv_allDisplay,
    'https://rest.fnar.net/fioweb/grouphub',
    'POST',
    ['Authorization', parameters[2]],
    JSON.stringify(usernames),
  );
  return;
}

function FIOInv_allDisplay(tile, parameters, jsondata) {
  let groupData = [];
  try {
    groupData = JSON.parse(jsondata);
  } catch (SyntaxError) {
    tile.textContent = 'Error! Bad Data from FIO!';
  }
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('title');
  titleDiv.appendChild(createTextSpan(`${parameters[3]} Inventories`));
  tile.appendChild(titleDiv);
  const bodyDiv = document.createElement('div');
  tile.appendChild(bodyDiv);
  bodyDiv.classList.add('flex-table');

  if (groupData['PlayerModels'] == undefined) {
    tile.textContent = 'Error! Bad Data!';
    return;
  }

  groupData['PlayerModels'].forEach(player => {
    if (player['Locations'].length == 0) {
      return;
    }
    const playerDiv = document.createElement('div');
    playerDiv.classList.add('list');
    playerDiv.appendChild(createTextSpan(player['UserName']));
    (playerDiv.firstChild as HTMLElement).style.fontWeight = 'bold';
    player['Locations'].forEach(location => {
      playerDiv.appendChild(
        createLink(
          location['LocationName'],
          `XIT INV_${player['UserName']}_${location['LocationName'].replace(/ /, '_')}`,
        ),
      );
      return;
    });

    bodyDiv.appendChild(playerDiv);
    return;
  });
  parameters.pop();
  parameters.pop();
  return;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fioMatsAlphabetSort(itemA: any, itemB: any) {
  const tickerA = itemA['MaterialTicker'];
  const tickerB = itemB['MaterialTicker'];
  return materialSort(tickerA, tickerB);
}

xit.add({
  command: 'INV',
  name: 'FIO INVENTORY',
  component: createXitAdapter(FIOInventory),
});
