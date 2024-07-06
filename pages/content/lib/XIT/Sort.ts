import {
  clearChildren,
  createTextSpan,
  setSettings,
  makePopupSpacer,
  createPopupInputRow,
  createPopupCheckboxRow,
  getValueOfPopupRow,
  getCheckOfPopupRow,
  createSmallButton,
} from '../util';
import { Style } from '../Style';

export class Sort {
  private tile: HTMLElement;
  private parameters: string[];
  private pmmgSettings;
  public name = 'SORTING OPTIONS';

  constructor(tile, parameters, pmmgSettings) {
    this.tile = tile;
    this.parameters = parameters;
    this.pmmgSettings = pmmgSettings;
  }

  // Create the interface for adding and editing sorting options
  create_buffer() {
    // Create static versions of class parameters for use downstream
    const tile = this.tile;
    const parameters = this.parameters;
    const pmmgSettings = this.pmmgSettings;
    const sortObj = this;

    clearChildren(tile);
    if (!parameters[1]) {
      // Require a planet name be appended to the command
      tile.appendChild(createTextSpan('Add a planet name to the end of the command!'));
      return;
    }

    if (!pmmgSettings['PMMGExtended']['sorting']) {
      // Initialize the stored sorting settings if they don't exist
      pmmgSettings['PMMGExtended']['sorting'] = [];
    }

    const table = document.createElement('table'); // Create a table of all current sorting settings
    tile.appendChild(table);

    const head = document.createElement('thead');
    const headRow = document.createElement('tr');
    head.appendChild(headRow);
    table.appendChild(head);
    for (const title of ['Abbreviation', 'Categories', 'Modify']) {
      const header = document.createElement('th');
      header.textContent = title;
      header.style.paddingTop = '0';
      headRow.appendChild(header);
    }

    const body = document.createElement('tbody');
    table.appendChild(body);

    const addButton = document.createElement('button'); // Create a button to add a new sorting configuration
    addButton.textContent = 'Add New';
    tile.appendChild(addButton);
    addButton.style.marginLeft = '5px';
    addButton.style.marginTop = '5px';
    addButton.classList.add(...Style.Button);
    addButton.classList.add(...Style.ButtonSuccess);

    addButton.addEventListener('click', function () {
      // On click, create the interface for adding a new sorting configuration
      createAddInterface(sortObj, tile, pmmgSettings, parameters);
    });

    let isSorting = false; // Whether any sorting options exist
    pmmgSettings['PMMGExtended']['sorting'].forEach(settings => {
      // For each stored sorting option, test to only show the ones corresponding to the current planet
      if (!settings[0] || !settings[1] || !settings[2]) {
        return;
      }
      if (settings[1].toUpperCase() != parameters[1].toUpperCase()) {
        return;
      }
      isSorting = true;
      const row = document.createElement('tr'); // Create the table row
      const nameColumn = document.createElement('td');
      const catColumn = document.createElement('td');
      const modifyColumn = document.createElement('td');
      row.appendChild(nameColumn);
      row.appendChild(catColumn);
      row.appendChild(modifyColumn);

      body.appendChild(row);

      nameColumn.appendChild(createTextSpan(settings[0]));
      let categories = ''; // Create a list of categories by concatenating the category names with ", " in between
      settings[2].forEach(category => {
        if (!category[0]) {
          return;
        }
        categories += category[0] + ', ';
        return;
      });
      categories = categories.slice(0, -2); // Remove the last ", "
      catColumn.appendChild(createTextSpan(categories));

      modifyColumn.appendChild(
        createSmallButton('edit', createAddInterface, [sortObj, tile, pmmgSettings, parameters, settings]),
      ); // Create the edit button
      modifyColumn.appendChild(
        createSmallButton(
          'delete',
          function (pmmgSettings, row, settings) {
            // Create the delete button

            for (
              let i = 0;
              i < pmmgSettings['PMMGExtended']['sorting'].length;
              i++ // For each stored setting, find the one corresponding to the current row
            ) {
              if (pmmgSettings['PMMGExtended']['sorting'][i] == settings) {
                pmmgSettings['PMMGExtended']['sorting'].splice(i, 1); // Remove it and hide the row
                row.style.display = 'none';
                setSettings(pmmgSettings);
                break;
              }
            }
          },
          [pmmgSettings, row, settings],
        ),
      );
      return;
    });

    if (!isSorting) {
      // Append a message talking about there being no sorting options if none exist
      const line = document.createElement('tr');
      const textColumn = document.createElement('td');
      textColumn.colSpan = 3;
      textColumn.textContent = 'No Sorting Options';
      line.appendChild(textColumn);
      body.appendChild(line);
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

// Creates the interface to add a new sorting option
function createAddInterface(sortObj, tile, pmmgSettings, parameters, settings: any[] = []) {
  const prefilled = settings.length != 0;
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
  addInterface.classList.add('NLOrH7hF5fbKIesqW3uSkA==');
  addInterfaceWrapper.appendChild(addInterface);
  const addHeader = document.createElement('h3');
  addHeader.appendChild(document.createTextNode('Sorting Options Editor'));
  addHeader.classList.add(...Style.SidebarSectionHead);
  addInterface.appendChild(addHeader);
  addHeader.style.margin = '0.5em 0 0.5em';

  const form = document.createElement('div');
  addInterface.appendChild(form);

  form.appendChild(
    createPopupInputRow(
      'Abbreviation',
      prefilled ? settings[0] : '',
      'The abbreviation showing at the top of the inventory (ABC, CAT, etc.)',
    ),
  );

  if (prefilled) {
    for (let i = 0; i < settings[2].length; i++) {
      form.appendChild(
        createPopupInputRow(
          'Category ' + (i + 1) + ' Name',
          prefilled ? settings[2][i][0] : '',
          i == 0 ? 'The name of the first category for materials' : '',
        ),
      );
      form.appendChild(
        createPopupInputRow(
          'Category ' + (i + 1) + ' MATs',
          prefilled ? settings[2][i][1].join(', ') : '',
          i == 0 ? 'A list of materials in the first category. Separate tickers by a comma. (RAT, DW, etc.)' : '',
        ),
      );
    }
  } else {
    form.appendChild(createPopupInputRow('Category 1 Name', '', 'The name of the first category for materials.'));
    form.appendChild(
      createPopupInputRow(
        'Category 1 MATs',
        '',
        'A list of materials in the first category. Separate tickers by a comma. (RAT, DW, etc.)',
      ),
    );
  }
  const addRow = document.createElement('div');
  addRow.classList.add(...Style.FormSaveRow);
  form.appendChild(addRow);
  const addLabel = document.createElement('label');
  addLabel.textContent = 'Add Category';
  addLabel.classList.add(...Style.FormSaveLabel);
  addRow.appendChild(addLabel);
  const addInputDiv = document.createElement('div');
  addInputDiv.classList.add(...Style.FormSaveInput);
  addRow.appendChild(addInputDiv);
  const addButton = document.createElement('button');
  addButton.textContent = 'ADD CATEGORY';
  addButton.classList.add(...Style.Button);
  addButton.classList.add(...Style.ButtonPrimary);
  addInputDiv.appendChild(addButton);

  addButton.addEventListener('click', function () {
    const catNumber = (form.children.length - 3) / 2;
    form.insertBefore(createPopupInputRow('Category ' + catNumber + ' Name'), form.children[form.children.length - 4]);
    form.insertBefore(createPopupInputRow('Category ' + catNumber + ' MATs'), form.children[form.children.length - 4]);
  });

  //Create the burn row
  const burnRow = createPopupCheckboxRow(
    'Burn Sorting',
    settings[3] || false,
    'Add burn sorting as a secondary sorting method. Burn categories will show under the categories defined above.',
  );
  form.appendChild(burnRow);
  //Create zero items row
  const zeroRow = createPopupCheckboxRow(
    'Show Zeros',
    settings[4] || false,
    'Show item icons that have zero quantity.',
  );
  form.appendChild(zeroRow);

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

  saveButton.addEventListener('click', function () {
    const itemAbbreviation = getValueOfPopupRow(form.firstChild);

    const sortingInfo = [] as any[];
    for (var i = 1; i < form.children.length - 4; i += 2) {
      if (!form.children[i] || !form.children[i + 1]) {
        break;
      }
      if (getValueOfPopupRow(form.children[i]) == '' || getValueOfPopupRow(form.children[i + 1]) == '') {
        continue;
      }
      sortingInfo.push([
        getValueOfPopupRow(form.children[i]),
        getValueOfPopupRow(form.children[i + 1])
          .replace(/ /g, '')
          .split(','),
      ]);
    }

    tile.removeChild(overlapDiv);
    if (!itemAbbreviation) {
      return;
    }
    if (prefilled) {
      for (var i = 0; i < pmmgSettings['PMMGExtended']['sorting'].length; i++) {
        if (pmmgSettings['PMMGExtended']['sorting'][i] == settings) {
          pmmgSettings['PMMGExtended']['sorting'][i] = [
            itemAbbreviation,
            parameters[1],
            sortingInfo,
            getCheckOfPopupRow(burnRow),
            getCheckOfPopupRow(zeroRow),
          ];
          break;
        }
      }
    } else {
      pmmgSettings['PMMGExtended']['sorting'].push([
        itemAbbreviation,
        parameters[1],
        sortingInfo,
        getCheckOfPopupRow(burnRow),
        getCheckOfPopupRow(zeroRow),
      ]);
    }
    setSettings(pmmgSettings);
    sortObj.create_buffer();

    return;
  });

  greyStripes.appendChild(makePopupSpacer(tile, overlapDiv));
}
