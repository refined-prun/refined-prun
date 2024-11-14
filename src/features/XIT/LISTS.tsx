import {
  clearChildren,
  getLocalStorage,
  setSettings,
  createLink,
  createTextSpan,
  makePopupSpacer,
  createPopupInputRow,
  getValueOfPopupRow,
  showWarningDialog,
  Popup,
} from '@src/util';
import { Style } from '@src/Style';
import xit from './xit-registry';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

class CommandLists {
  private tile: HTMLElement;
  private parameters: string[];
  public name = 'COMMAND LIST';

  constructor(tile, parameters) {
    this.tile = tile;
    this.parameters = parameters;
  }

  create_buffer() {
    clearChildren(this.tile);
    if (this.parameters.length == 1) {
      // Display table of lists and links to open each or delete each
      getLocalStorage('PMMG-Lists', generateListTable, this.tile);
    } else {
      // Display the specified list
      getLocalStorage('PMMG-Lists', dispStoredList, [this.tile, this.parameters, this]);
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

function generateListTable(result, tile) {
  const table = document.createElement('table');
  tile.appendChild(table);

  const head = document.createElement('thead');
  const headRow = document.createElement('tr');
  head.appendChild(headRow);
  table.appendChild(head);
  for (const title of ['Name', 'Length', 'Delete']) {
    const header = document.createElement('th');
    header.textContent = title;
    header.style.paddingTop = '0';
    headRow.appendChild(header);
  }

  const body = document.createElement('tbody');
  table.appendChild(body);

  if (!result['PMMG-Lists']) {
    result['PMMG-Lists'] = {};
  }

  const names = Array.from(Object.keys(result['PMMG-Lists']));

  names.forEach(name => {
    const row = document.createElement('tr');
    const nameColumn = document.createElement('td');
    const lengthColumn = document.createElement('td');
    const deleteColumn = document.createElement('td');
    row.appendChild(nameColumn);
    row.appendChild(lengthColumn);
    row.appendChild(deleteColumn);

    body.appendChild(row);

    nameColumn.appendChild(createLink(name, `XIT LIST_${name}`));
    lengthColumn.appendChild(createTextSpan(result['PMMG-Lists'][name].length.toLocaleString()));

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'DELETE';
    deleteColumn.appendChild(deleteButton);
    deleteButton.addEventListener('click', () => {
      showWarningDialog(tile, `Are you sure you want to delete ${name}?`, 'Confirm', () => {
        getLocalStorage('PMMG-Lists', updateThenStoreList, [name, '']);
        row.style.display = 'none';
        return;
      });
      return;
    });
  });

  if (names.length == 0) {
    const line = document.createElement('tr');
    const textColumn = document.createElement('td');
    textColumn.colSpan = 3;
    textColumn.textContent = 'No Command Lists.';
    line.appendChild(textColumn);
    body.appendChild(line);
  }

  const newButton = document.createElement('button');
  newButton.classList.add(...Style.Button);
  newButton.classList.add(...Style.ButtonPrimary);
  newButton.style.margin = '5px';

  newButton.textContent = 'NEW COMMAND LIST';
  newButton.addEventListener('click', () => {
    const popup = new Popup(tile, 'New Command List');
    popup.addPopupRow(
      'text',
      'List Name',
      '',
      'The name of the command list. The command to access will be XIT LIST_{name}',
      () => {},
    );
    popup.addPopupRow('button', 'CMD', 'Create', undefined, () => {
      const nameRow = popup.getRowByName('List Name');
      if (!nameRow || !nameRow.rowInput) {
        return;
      }
      showBuffer(`XIT LIST_${nameRow.rowInput.value || ''}`);
      popup.destroy();
    });
  });
  tile.appendChild(newButton);
  return;
}

function updateThenStoreList(result, params) {
  if (!params || !params[0]) {
    return;
  }
  const noteName = params[0];
  const noteText = params[1];
  if (!result['PMMG-Lists']) {
    result['PMMG-Lists'] = {};
  }
  result['PMMG-Lists'][noteName] = noteText.length == 0 ? undefined : noteText;
  setSettings(result);
  return;
}

function dispStoredList(result, param) {
  const tile = param[0];
  const parameters = param[1];
  const listObj = param[2];
  const listName = parameters.slice(1).join('_');

  const nameDiv = document.createElement('div');
  nameDiv.classList.add('title');
  nameDiv.textContent = listName;
  tile.appendChild(nameDiv);
  if (!result['PMMG-Lists']) {
    result['PMMG-Lists'] = {};
  }
  const table = document.createElement('table');
  tile.appendChild(table);

  const head = document.createElement('thead');
  const headRow = document.createElement('tr');
  head.appendChild(headRow);
  table.appendChild(head);
  for (const title of ['']) {
    const header = document.createElement('th');
    header.textContent = title;
    header.style.paddingTop = '0';
    headRow.appendChild(header);
  }

  const body = document.createElement('tbody');
  table.appendChild(body);

  if (result['PMMG-Lists'][listName] && result['PMMG-Lists'][listName].length > 0) {
    result['PMMG-Lists'][listName].forEach(linkInfo => {
      if (!linkInfo[0] || !linkInfo[1]) {
        return;
      }
      const line = document.createElement('tr');
      const textColumn = document.createElement('td');

      textColumn.appendChild(createLink(linkInfo[0], linkInfo[1]));

      line.appendChild(textColumn);
      body.appendChild(line);
      return;
    });
  } else {
    const line = document.createElement('tr');
    const textColumn = document.createElement('td');
    textColumn.colSpan = 1;
    textColumn.textContent = 'No Commands.';
    line.appendChild(textColumn);
    body.appendChild(line);
  }

  const addButton = document.createElement('button'); // Create a button to add a new sorting configuration
  addButton.textContent = 'Edit';
  tile.appendChild(addButton);
  addButton.style.marginLeft = '5px';
  addButton.style.marginTop = '5px';
  addButton.classList.add(...Style.Button);
  addButton.classList.add(...Style.ButtonPrimary);

  addButton.addEventListener('click', () => {
    createEditInterface(tile, result, parameters, result['PMMG-Lists'][listName] || [], listObj);
    return;
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createEditInterface(tile, result, parameters, settings: any[] = [], listObj) {
  const prefilled = settings.length != 0;

  const listName = parameters.slice(1).join('_');

  const overlapDiv = document.createElement('div');
  overlapDiv.classList.add(...Style.OverlappingDiv);
  const greyStripes = document.createElement('div');
  greyStripes.classList.add(...Style.GreyStripes);
  overlapDiv.appendChild(greyStripes);
  tile.insertBefore(overlapDiv, tile.firstChild);

  greyStripes.appendChild(makePopupSpacer(tile, overlapDiv));
  const addInterfaceWrapper = document.createElement('div');
  addInterfaceWrapper.classList.add(...Style.CenterInterface);
  greyStripes.appendChild(addInterfaceWrapper);
  const addInterface = document.createElement('div');
  addInterface.classList.add('DraftConditionEditor__form___fF72bJM');
  addInterfaceWrapper.appendChild(addInterface);
  const addHeader = document.createElement('h3');
  addHeader.appendChild(document.createTextNode('Command List Editor'));
  addHeader.classList.add(...Style.SidebarSectionHead);
  addInterface.appendChild(addHeader);
  addHeader.style.margin = '0.5em 0 0.5em';

  const form = document.createElement('div');
  addInterface.appendChild(form);

  if (prefilled) {
    for (let i = 0; i < settings.length; i++) {
      form.appendChild(
        createPopupInputRow(
          `Link ${i + 1} Label`,
          settings[i][0],
          i == 0 ? 'The label of the first link.' : '',
        ),
      );
      form.appendChild(
        createPopupInputRow(
          `Link ${i + 1} Command`,
          settings[i][1],
          i == 0 ? 'The command opened by the first link (ex: CX NC1)' : '',
        ),
      );
    }
  } else {
    form.appendChild(createPopupInputRow('Link 1 Label', '', 'The label of the first link.'));
    form.appendChild(
      createPopupInputRow(
        'Link 1 Command',
        '',
        'The command opened by the first link (ex: CX NC1)',
      ),
    );
  }

  const addRow = document.createElement('div');
  addRow.classList.add(...Style.FormSaveRow);
  form.appendChild(addRow);
  const addLabel = document.createElement('label');
  addLabel.textContent = 'Add Link';
  addLabel.classList.add(...Style.FormSaveLabel);
  addRow.appendChild(addLabel);
  const addInputDiv = document.createElement('div');
  addInputDiv.classList.add(...Style.FormSaveInput);
  addRow.appendChild(addInputDiv);
  const addButton = document.createElement('button');
  addButton.textContent = 'ADD LINK';
  addButton.classList.add(...Style.Button);
  addButton.classList.add(...Style.ButtonPrimary);
  addInputDiv.appendChild(addButton);

  addButton.addEventListener('click', () => {
    const catNumber = form.children.length / 2;
    form.insertBefore(
      createPopupInputRow(`Link ${catNumber} Label`),
      form.children[form.children.length - 2],
    );
    form.insertBefore(
      createPopupInputRow(`Link ${catNumber} Command`),
      form.children[form.children.length - 2],
    );
  });

  const saveRow = document.createElement('div');
  saveRow.classList.add(...Style.FormSaveRow);
  form.appendChild(saveRow);
  const saveLabel = document.createElement('label');
  saveLabel.textContent = 'CMD';
  saveLabel.classList.add(...Style.FormSaveLabel);
  saveRow.appendChild(saveLabel);
  const saveInputDiv = document.createElement('div');
  saveInputDiv.classList.add(...Style.FormSaveInput);
  saveRow.appendChild(saveInputDiv);
  const saveButton = document.createElement('button');
  saveButton.textContent = 'SAVE';
  saveButton.classList.add(...Style.Button);
  saveButton.classList.add(...Style.ButtonPrimary);
  saveInputDiv.appendChild(saveButton);

  saveButton.addEventListener('click', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const commandInfo = [] as any[];
    for (let i = 0; i < form.children.length - 2; i += 2) {
      if (!form.children[i] || !form.children[i + 1]) {
        break;
      }
      if (
        getValueOfPopupRow(form.children[i]) == '' ||
        getValueOfPopupRow(form.children[i + 1]) == ''
      ) {
        continue;
      }
      commandInfo.push([
        getValueOfPopupRow(form.children[i]),
        getValueOfPopupRow(form.children[i + 1]),
      ]);
    }

    tile.removeChild(overlapDiv);

    result['PMMG-Lists'][listName] = commandInfo;
    setSettings(result);
    listObj.create_buffer();

    return;
  });

  greyStripes.appendChild(makePopupSpacer(tile, overlapDiv));
  return;
}

xit.add({
  command: ['LIST', 'LISTS'],
  name: 'COMMAND LIST',
  description: 'Provides a customizable list of command links.',
  optionalParameters: 'List Name',
  module: CommandLists,
});
