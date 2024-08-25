/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-this-alias */
import {
  changeValue,
  clearChildren,
  comparePlanets,
  createEmptyTableRow,
  createLink,
  createTable,
  createTextSpan,
  getBuffers,
  getBuffersFromList,
  getLocalStoragePromise,
  Popup,
  setSettings,
  showBuffer,
  showSuccessDialog,
  showWarningDialog,
} from '../util';
import { Style } from '../Style';
import { Selector } from '../Selector';
import { ExchangeTickersReverse, NonProductionBuildings } from '../GameProperties';
import xit from './xit-registry';
import { cxobStore } from '@src/prun-api/data/cxob';
import { workforcesStore } from '@src/prun-api/data/workforces';
import { productionStore } from '@src/prun-api/data/production';
import { storagesStore } from '@src/prun-api/data/storage';
import { getBuildingLastRepair, sitesStore } from '@src/prun-api/data/sites';
import { calculatePlanetBurn } from '@src/core/burn';
import { getPlanetNameFromAddress } from '@src/prun-api/data/addresses';
import { warehousesStore } from '@src/prun-api/data/warehouses';

class Execute {
  private tile: HTMLElement;
  public parameters: string[];
  public pmmgSettings;
  public name = 'ACTION PACKAGE';

  constructor(tile, parameters, pmmgSettings) {
    this.tile = tile;
    this.parameters = parameters;
    this.pmmgSettings = pmmgSettings;

    if (!parameters[1]) {
      this.name = 'ACTION PACKAGES';
    } else if (parameters[1].toLowerCase() == 'gen') {
      this.name = 'GENERATE ACTION PACKAGE';
    } else {
      this.name = 'EXECUTE ACTION PACKAGE';
    }
  }

  async create_buffer() {
    clearChildren(this.tile);

    if (this.parameters.length == 1) {
      // Create table of all action packages with option to create more?
      createSummaryScreen(this.tile, this);
    } else if (this.parameters[1] && this.parameters[1].toLowerCase() == 'gen') {
      // Generate the creation/edit screen
      createGenerateScreen(this.tile, this.parameters.slice(2).join(' '));
    } else {
      createExecuteScreen(this.tile, this.parameters.slice(1).join(' '));
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

// All functions associated with the summary screen
async function createSummaryScreen(tile, parentBuffer) {
  let storageValue = await getLocalStoragePromise('PMMG-Action');
  let storedActions = storageValue['PMMG-Action'] || {};

  // Add row on top for creating a new action package
  const createRow = document.createElement('div');
  createRow.classList.add(...Style.ActionBarContainer);
  createRow.style.paddingTop = '2px';
  tile.appendChild(createRow);

  const createButtonContainer = document.createElement('div');
  createButtonContainer.classList.add(...Style.ActionBarElement);
  createRow.appendChild(createButtonContainer);

  const createButton = document.createElement('button');
  createButton.textContent = 'CREATE NEW';
  createButton.classList.add(...Style.Button);
  createButton.classList.add(...Style.ButtonPrimary);
  createButtonContainer.appendChild(createButton);

  // Generate popup asking for name of package
  createButton.addEventListener('click', () => {
    const popup = new Popup(tile, 'Create Action Package');
    popup.addPopupRow('text', 'Name', undefined, undefined, undefined);

    popup.addPopupRow('button', 'CMD', 'OPEN', undefined, () => {
      const nameRow = popup.getRowByName('Name');
      if (nameRow.rowInput.value && nameRow.rowInput.value != '') {
        showBuffer(`XIT ACTION_GEN_${nameRow.rowInput.value.split(' ').join('_')}`);
        popup.destroy();
      } else {
        nameRow.row.classList.add(...Style.FormError);
      }
    });
  });

  // Add import button
  const importButtonContainer = document.createElement('div');
  importButtonContainer.classList.add(...Style.ActionBarElement);
  createRow.appendChild(importButtonContainer);

  const importButton = document.createElement('button');
  importButton.textContent = 'IMPORT';
  importButton.classList.add(...Style.Button);
  importButton.classList.add(...Style.ButtonPrimary);
  importButtonContainer.appendChild(importButton);

  // Generate popup to deal with import
  importButton.addEventListener('click', () => {
    const popup = new Popup(tile, 'Import Action Package');
    popup.addPopupRow(
      'dropdown',
      'Type',
      ['Paste JSON', 'Upload JSON', 0],
      'Which style of import to use. Ping Pi314 on Discord for format specifics. Official documentation coming soon.',
      () => {
        // Change the next row to the correct type of import row
        popup.removePopupRow(1);

        const typeRow = popup.getRowByName('Type');
        const importType = typeRow.rowInput.value;

        let importRow;
        let importElem;

        switch (importType) {
          case 'Paste JSON':
            popup.addPopupRow('text', 'Import', undefined, undefined, undefined);
            break;
          case 'Upload JSON': {
            popup.addPopupRow('button', 'Import', 'UPLOAD', undefined, () => {
              // Trigger file import
              fileInput.click();
            });
            importRow = popup.getRowByName('Import');
            importElem = importRow.rowInput; // The import button

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            fileInput.style.display = 'none';
            importElem.appendChild(fileInput);
            break;
          }
        }

        popup.moveRowToBottom(1);
      },
    );

    // Default import row
    popup.addPopupRow('text', 'Import', undefined, undefined, undefined);

    // Save row
    popup.addPopupRow('button', 'CMD', 'IMPORT', undefined, async () => {
      // Parse then save the imported data
      const typeRow = popup.getRowByName('Type');
      const importType = typeRow.rowInput.value;

      const importRow = popup.getRowByName('Import');

      let parsedData;
      switch (importType) {
        case 'Paste JSON': {
          const rawData = importRow.rowInput.value;
          try {
            parsedData = JSON.parse(rawData);

            if (!parsedData.global || !parsedData.global.name) {
              importRow.row.classList.add(...Style.FormError);
              return;
            }
          } catch {
            importRow.row.classList.add(...Style.FormError);
            return;
          }
          break;
        }
        case 'Upload JSON': {
          const fileImport = importRow.rowInput.children[0];
          if (fileImport) {
            if (fileImport.files && fileImport.files[0]) {
              const file = fileImport.files[0];

              const reader = new FileReader();
              reader.onload = async function (e) {
                // Do the saving in here rather than at the end
                if (!e || !e.target) {
                  return;
                }
                try {
                  parsedData = JSON.parse(e.target.result as string);
                  const storageValue = await getLocalStoragePromise('PMMG-Action');
                  const storedActions = storageValue['PMMG-Action'] || {};

                  storedActions[parsedData.global.name] = parsedData;
                  setSettings({ 'PMMG-Action': storedActions });
                  popup.destroy();
                  parentBuffer.create_buffer();
                } catch {
                  importRow.row.classList.add(...Style.FormError);
                  return;
                }
              };
              reader.readAsText(file);
              return;
            }
            importRow.row.classList.add(...Style.FormError);
            return;
          }
          importRow.row.classList.add(...Style.FormError);
          return;
        }
      }

      const storageValue = await getLocalStoragePromise('PMMG-Action');
      const storedActions = storageValue['PMMG-Action'] || {};

      storedActions[parsedData.global.name] = parsedData;
      setSettings({ 'PMMG-Action': storedActions });
      popup.destroy();
      parentBuffer.create_buffer();
    });
  });

  // Now generate table of all action packages
  const table = createTable(tile, ['Name', 'Execute', 'Edit', 'Cmds']);

  const packageNames = Object.keys(storedActions);

  if (packageNames.length == 0) {
    table.appendChild(
      createEmptyTableRow(4, 'No action packages found. Click above to create one'),
    );
  }

  packageNames.forEach(name => {
    const friendlyName = name.split('_').join(' ');
    const paramName = name.split(' ').join('_');

    const row = document.createElement('tr');

    // Name column
    const nameColumn = document.createElement('td');
    nameColumn.appendChild(createLink(friendlyName, `XIT ACTION_${paramName}`));
    row.appendChild(nameColumn);

    // Execute column (pulls up execution screen)
    const execColumn = document.createElement('td');
    const execButton = document.createElement('button');
    execButton.textContent = 'EXECUTE';
    execButton.classList.add(...Style.Button);
    execButton.classList.add(...Style.ButtonPrimary);
    execColumn.appendChild(execButton);
    row.appendChild(execColumn);
    execButton.addEventListener('click', () => {
      showBuffer(`XIT ACTION_${paramName}`);
    });

    // Edit column (pulls up GEN screen)
    const editColumn = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'EDIT';
    editButton.classList.add(...Style.Button);
    editButton.classList.add(...Style.ButtonPrimary);
    editColumn.appendChild(editButton);
    row.appendChild(editColumn);
    editButton.addEventListener('click', () => {
      showBuffer(`XIT ACTION_GEN_${paramName}`);
    });

    // Other commands (delete, copy in the future?)
    const cmdColumn = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'delete';
    deleteButton.classList.add(...Style.SmallButton);
    cmdColumn.appendChild(deleteButton);
    row.appendChild(cmdColumn);
    deleteButton.addEventListener('click', () => {
      showWarningDialog(
        tile,
        'Are you sure you want to delete this action package?',
        'Confirm',
        async () => {
          storageValue = await getLocalStoragePromise('PMMG-Action');
          storedActions = storageValue['PMMG-Action'] || {};

          delete storedActions[name];
          setSettings({ 'PMMG-Action': storedActions });
          parentBuffer.create_buffer();
        },
      );
    });

    table.appendChild(row);
  });
}

// All functions associated with generating/editing action packages
async function createGenerateScreen(tile, packageName) {
  if (!packageName || packageName == '') {
    tile.textContent = 'Error: Please name the action package by including an extra parameter';
    return;
  }
  const storageValue = await getLocalStoragePromise('PMMG-Action');
  const storedActions = storageValue['PMMG-Action'] || {};

  const isNew = !storedActions[packageName]; // Whether or not the package is new or if we need to pull from memory

  let actionPackage;
  if (isNew) {
    actionPackage = { global: { name: packageName }, groups: [], actions: [] };
  } else {
    actionPackage = storedActions[packageName];
    if (!actionPackage.global || !actionPackage.global.name || actionPackage.global.name == '') {
      tile.textContent = 'Error: Stored action package has no name';
      return;
    }
  }

  new GenerateScreen(tile, actionPackage);
}

// Class for holding info on the screen for generating action packages
class GenerateScreen {
  public tile: HTMLElement;

  // Sections for each part of the screen (containing all rows)
  public globalSection?: HTMLElement;
  public groupSection?: HTMLElement;
  public actionSection?: HTMLElement;
  public saveSection?: HTMLElement;

  /*	// No more name row. It's fixed in the parameters
  public nameRow: HTMLElement;
  public nameInput: HTMLInputElement;
  */

  // Variables to store data inputted on screen
  public globalAttributes;
  public actions: any[];
  public groups: any[];

  constructor(tile, actionPackage) {
    this.tile = tile;
    this.globalAttributes = actionPackage.global || {};
    this.actions = actionPackage.actions || [];
    this.groups = actionPackage.groups || [];

    this.generateGlobalForm();
    this.generateGroupForm();
    this.generateActionForm();
    this.generateSaveForm();
  }

  // Generate the form for global attributes
  private generateGlobalForm() {
    if (!this.globalSection) {
      this.globalSection = document.createElement('div');
      this.tile.appendChild(this.globalSection);
    } else {
      clearChildren(this.globalSection);
    }

    const title = document.createElement('h2');
    title.textContent = this.globalAttributes.name || 'unnamed';
    title.classList.add(...Style.DraftName);
    title.style.marginLeft = '4px';
    this.globalSection.appendChild(title);
  }

  // Generate the form for groups
  private generateGroupForm() {
    const thisObj = this; // A way to pass this into subsequent functions like action listeners
    if (!this.groupSection) {
      this.groupSection = document.createElement('div');
      this.tile.appendChild(this.groupSection);
    } else {
      clearChildren(this.groupSection);
    }

    const sectionTitle = document.createElement('h3');
    sectionTitle.classList.add(...Style.SidebarSectionHead);
    sectionTitle.textContent = 'Material Groups';
    this.groupSection.appendChild(sectionTitle);

    const tableContainer = document.createElement('div');
    tableContainer.style.marginBottom = '0.75rem';
    this.groupSection.appendChild(tableContainer);
    const groupTable = createTable(tableContainer, ['Type', 'Name', 'Content', 'Cmds']); // Table body for table listing all material groups
    // Create empty row if no groups found
    if (this.groups.length == 0) {
      groupTable.appendChild(createEmptyTableRow(4, 'No groups found. Click add below'));
    }
    // Populate table otherwise
    this.groups.forEach((group, groupIndex) => {
      let contentText;
      const row = document.createElement('tr');

      // Column stating the type of the group on the row. "Manual", "Resupply", etc
      const typeColumn = document.createElement('td');
      typeColumn.appendChild(createTextSpan(group.type));
      row.appendChild(typeColumn);

      // Column stating the name of the group on the row
      const nameColumn = document.createElement('td');
      nameColumn.appendChild(createTextSpan(group.name || '--'));
      row.appendChild(nameColumn);

      // Column containing a summary of the material group parameters
      const contentColumn = document.createElement('td');
      row.appendChild(contentColumn);
      switch (
        group.type // Populate content column based on material group type
      ) {
        case 'Manual':
          if (group.materials) {
            contentText = '';
            Object.keys(group.materials).forEach(mat => {
              contentText += `${group.materials[mat].toLocaleString(undefined, { maximumFractionDigits: 0 })} ${mat}, `;
            });
            contentText = contentText.slice(0, -2); // Remove last comma and space
            contentColumn.appendChild(createTextSpan(contentText));
          } else {
            contentColumn.appendChild(createTextSpan('--'));
          }
          break;
        case 'Resupply':
          if (group.planet && group.days) {
            contentText = `Resupply ${group.planet} with ${group.days} day${group.days == 1 ? '' : 's'} of supplies`;
            contentColumn.appendChild(createTextSpan(contentText));
          } else {
            contentColumn.appendChild(createTextSpan('--'));
          }
          break;
        case 'Repair':
          if (group.planet) {
            contentText = `Repair buildings on ${group.planet}${
              group.days && group.days != 0 && group.days != ''
                ? ` older than ${group.days} day${group.days == 1 ? ' ' : 's '}`
                : ''
            } in ${group.advanceDays || 0} day${(group.advanceDays || 0) == 1 ? '' : 's'}`;
            contentColumn.appendChild(createTextSpan(contentText));
          } else {
            contentColumn.appendChild(createTextSpan('--'));
          }
          break;
      }

      // Column containing buttons to edit/delete
      const commandColumn = document.createElement('td');
      row.appendChild(commandColumn);

      const editButton = document.createElement('button'); // Edit the group
      const deleteButton = document.createElement('button'); // Delete the group
      editButton.classList.add(...Style.SmallButton);
      deleteButton.classList.add(...Style.SmallButton);
      editButton.textContent = 'edit';
      deleteButton.textContent = 'delete';
      commandColumn.appendChild(editButton);
      commandColumn.appendChild(deleteButton);

      // Add delete button functionality
      deleteButton.addEventListener('click', () => {
        showWarningDialog(
          thisObj.tile,
          'Are you sure you want to delete this group?',
          'Confirm',
          () => {
            thisObj.groups.splice(groupIndex, 1);
            thisObj.generateGroupForm();
          },
        );
      });

      // Add edit button functionality
      editButton.addEventListener('click', () => {
        thisObj.createGroupPopup(groupIndex);
      });

      groupTable.appendChild(row);
    });

    // Dropdown for adding new groups
    const newGroupDropdown = this.createFormRow(
      this.groupSection,
      'select',
      'active',
      'Group Type',
      'groupType',
      undefined,
      ['Resupply', 'Repair', 'Manual'],
    );
    const newGroupAdd = this.createFormRow(
      this.groupSection,
      'button',
      'command',
      'Add Group',
      'addGroup',
      'ADD',
    );

    // Add method for adding a new group with default values
    newGroupAdd.addEventListener('click', () => {
      thisObj.groups.push({ type: newGroupDropdown.value });
      thisObj.generateGroupForm();
    });
  }

  // Create the oppup interface for editing a material group
  private createGroupPopup(groupIndex) {
    const group = this.groups[groupIndex];

    // Popup object for inputting group parameters
    const popup = new Popup(this.tile, 'Material Group Editor');

    // Add row to enter name
    popup.addPopupRow('text', 'Name', group.name, undefined, undefined);

    // Add other rows depending on the group type
    switch (group.type) {
      case 'Resupply': {
        // Get list of planets
        const possiblePlanets = [] as any[];
        workforcesStore.all.value.forEach(planet => {
          const name = getPlanetNameFromAddress(planet.address);
          if (name) {
            possiblePlanets.push(name);
          }
        });

        possiblePlanets.sort(comparePlanets);

        // Add index of selected option to end of list because of poor design decisions in popup class
        if (group.planet && possiblePlanets.indexOf(group.planet)) {
          possiblePlanets.push(possiblePlanets.indexOf(group.planet));
        } else {
          possiblePlanets.push(0);
        }

        popup.addPopupRow('dropdown', 'Planet', possiblePlanets, undefined, undefined);
        popup.addPopupRow(
          'number',
          'Days',
          group.days || 10,
          'The number of days of supplies to refill the planet with.',
          undefined,
        );
        popup.addPopupRow(
          'text',
          'Material Exclusions',
          (group.exclusions || []).join(', '),
          'Materials to be excluded from the group. List material tickers separated by commas.',
          undefined,
        );
        popup.addPopupRow(
          'checkbox',
          'Use Base Inv',
          group.useBaseInv == undefined ? true : group.useBaseInv,
          'Whether to count the materials currently in the base towards the totals.',
          undefined,
        );
        break;
      }
      case 'Repair': {
        // Get list of planets
        const possiblePlanets = [] as any[];
        sitesStore.all.value.forEach(planet => {
          const name = getPlanetNameFromAddress(planet.address);
          if (name) {
            possiblePlanets.push(name);
          }
        });

        possiblePlanets.sort(comparePlanets);

        // Add index of selected option to end of list because of poor design decisions in popup class
        if (group.planet && possiblePlanets.indexOf(group.planet)) {
          possiblePlanets.push(possiblePlanets.indexOf(group.planet));
        } else {
          possiblePlanets.push(0);
        }
        popup.addPopupRow('dropdown', 'Planet', possiblePlanets, undefined, undefined);
        popup.addPopupRow(
          'number',
          'Day Threshold',
          group.days || '',
          'All buildings older than this threshold will be repaired. If no number is provided all buildings are repaired.',
          undefined,
        );
        popup.addPopupRow(
          'number',
          'Time Offset',
          group.advanceDays || 0,
          'The numer of days in the future this repair will be conducted.',
          undefined,
        );
        break;
      }
      case 'Manual': {
        // Create rows corresponding to current materials stored in group
        let numMaterials = 0; // Stores how many materials there are listed
        if (group.materials) {
          Object.keys(group.materials).forEach(mat => {
            popup.addPopupRow(
              'text',
              `Material Ticker #${(numMaterials + 1).toLocaleString()}`,
              mat,
              undefined,
              undefined,
            );
            popup.addPopupRow(
              'number',
              `Material Amount #${(numMaterials + 1).toLocaleString()}`,
              group.materials[mat],
              undefined,
              undefined,
            );
            numMaterials++;
          });
        }

        // Row for adding more material rows above
        popup.addPopupRow(
          'button',
          'Add Material',
          'ADD',
          'Add a new material to the group.',
          () => {
            const newMatRow = popup.addPopupRow(
              'text',
              `Material Ticker #${(numMaterials + 1).toLocaleString()}`,
              undefined,
              undefined,
              undefined,
            );
            const newAmtRow = popup.addPopupRow(
              'number',
              `Material Amount #${(numMaterials + 1).toLocaleString()}`,
              undefined,
              undefined,
              undefined,
            );
            numMaterials++;

            // Move rows above save rows
            popup.form.insertBefore(
              newMatRow.row,
              popup.form.children[popup.form.children.length - 4],
            );
            popup.form.insertBefore(
              newAmtRow.row,
              popup.form.children[popup.form.children.length - 3],
            );
          },
        );
        break;
      }
    }

    // Add row to save and corresponding function
    const thisObj = this;
    popup.addPopupRow('button', 'CMD', 'SAVE', undefined, () => {
      const nameRow = popup.getRowByName('Name');
      const name = nameRow.rowInput.value;

      if (name && name != '') {
        group.name = name;

        switch (group.type) {
          case 'Resupply': {
            group.planet = popup.getRowByName('Planet').rowInput.value;
            group.days = parseFloat(popup.getRowByName('Days').rowInput.value || 0);
            group.useBaseInv = popup.getRowByName('Use Base Inv').rowInput.checked;
            const exclusions = popup.getRowByName('Material Exclusions').rowInput.value;
            if (exclusions && exclusions != '') {
              group.exclusions = exclusions.replace(/ /g, '').split(',');
            } else {
              delete group.exclusions;
            }
            break;
          }
          case 'Repair': {
            group.planet = popup.getRowByName('Planet').rowInput.value;
            group.days = popup.getRowByName('Day Threshold').rowInput.value;
            group.advanceDays = popup.getRowByName('Time Offset').rowInput.value;
            break;
          }
          case 'Manual': {
            group.materials = {};

            const numMaterials = (popup.rows.length - 3) / 2;
            // Loop through the rows and extract the materials and amounts
            for (let i = 1; i <= numMaterials; i++) {
              const matRow = popup.getRowByName(`Material Ticker #${i.toLocaleString()}`);
              const amtRow = popup.getRowByName(`Material Amount #${i.toLocaleString()}`);
              const mat = matRow.rowInput.value;
              const matAmt = parseInt(amtRow.rowInput.value, 10);

              if (mat && mat != '' && matAmt && !isNaN(matAmt) && matAmt > 0) {
                group.materials[mat] = matAmt;
              }
            }
            break;
          }
        }
        popup.destroy();
        thisObj.generateGroupForm();
      } // If no valid name, throw an error
      else {
        nameRow.row.classList.add(...Style.FormError);
      }
    });
  }

  // Generate the form for actions
  private generateActionForm() {
    const thisObj = this; // A way to pass this into subsequent functions like action listeners
    if (!this.actionSection) {
      this.actionSection = document.createElement('div');
      this.tile.appendChild(this.actionSection);
    } else {
      clearChildren(this.actionSection);
    }

    const sectionTitle = document.createElement('h3');
    sectionTitle.classList.add(...Style.SidebarSectionHead);
    sectionTitle.textContent = 'Actions';
    this.actionSection.appendChild(sectionTitle);

    const tableContainer = document.createElement('div');
    tableContainer.style.marginBottom = '0.75rem';
    this.actionSection.appendChild(tableContainer);
    const actionTable = createTable(tableContainer, ['Type', 'Name', 'Content', 'Cmds']); // Table body for table listing all material groups
    // Create empty row if no groups found
    if (this.actions.length == 0) {
      actionTable.appendChild(createEmptyTableRow(4, 'No actions found. Click add below'));
    }

    // Populate table
    this.actions.forEach((action, actionIndex) => {
      // Create row
      const row = document.createElement('tr');

      /*	// No move buttons for now while there is only one type of action
      // Create moving up/down button
      const moveColumn = document.createElement("td");
      moveColumn.style.width = "48.5px";
      row.appendChild(moveColumn);
      */

      // Column stating the type of the group on the row. "CX Buy"
      const typeColumn = document.createElement('td');
      typeColumn.appendChild(createTextSpan(action.type));
      row.appendChild(typeColumn);

      // Column stating the name of the group on the row
      const nameColumn = document.createElement('td');
      nameColumn.appendChild(createTextSpan(action.name || '--'));
      row.appendChild(nameColumn);

      // Column summarizing parameters of action
      const contentColumn = document.createElement('td');
      switch (action.type) {
        case 'CX Buy':
          if (action.group && action.exchange) {
            contentColumn.appendChild(
              createTextSpan(`Buying group ${action.group} from ${action.exchange}`),
            );
          } else {
            contentColumn.appendChild(createTextSpan('--'));
          }
          break;
      }
      row.appendChild(contentColumn);

      // Column with buttons to edit/delete
      const commandColumn = document.createElement('td');
      row.appendChild(commandColumn);

      const editButton = document.createElement('button'); // Edit the group
      const deleteButton = document.createElement('button'); // Delete the group
      editButton.classList.add(...Style.SmallButton);
      deleteButton.classList.add(...Style.SmallButton);
      editButton.textContent = 'edit';
      deleteButton.textContent = 'delete';
      commandColumn.appendChild(editButton);
      commandColumn.appendChild(deleteButton);

      // Add delete button functionality
      deleteButton.addEventListener('click', () => {
        showWarningDialog(
          thisObj.tile,
          'Are you sure you want to delete this action?',
          'Confirm',
          () => {
            thisObj.actions.splice(actionIndex, 1);
            thisObj.generateActionForm();
          },
        );
      });

      // Add edit button functionality
      editButton.addEventListener('click', () => {
        thisObj.createActionPopup(actionIndex);
      });

      actionTable.appendChild(row);
    });

    // Dropdown for adding new groups
    const newActionDropdown = this.createFormRow(
      this.actionSection,
      'select',
      'active',
      'Action Type',
      'actionType',
      undefined,
      ['CX Buy'],
    );
    const newActionAdd = this.createFormRow(
      this.actionSection,
      'button',
      'command',
      'Add Action',
      'addAction',
      'ADD',
    );

    // Add method for adding a new group with default values
    newActionAdd.addEventListener('click', () => {
      thisObj.actions.push({ type: newActionDropdown.value });
      thisObj.generateActionForm();
    });
  }

  // Create the oppup interface for editing an action
  private createActionPopup(actionIndex) {
    const thisObj = this;
    const action = this.actions[actionIndex];

    // Popup object for inputting group parameters
    const popup = new Popup(this.tile, 'Action Editor');

    // Add row to enter name
    popup.addPopupRow('text', 'Name', action.name, undefined, undefined);

    // Add more rows depending on the type of the action
    switch (action.type) {
      case 'CX Buy': {
        // Add group dropdown
        const groupNames = this.groups
          .filter(obj => obj.name && obj.name !== '')
          .map(obj => obj.name);
        // Add index of selected option to end of list because of poor design decisions in popup class
        if (action.group && groupNames.indexOf(action.group)) {
          groupNames.push(groupNames.indexOf(action.group));
        } else {
          groupNames.push(0);
        }

        popup.addPopupRow('dropdown', 'Material Group', groupNames, undefined, undefined);

        // Add exchanges dropdown
        // Add index of selected option to end of list because of poor design decisions in popup class
        const exchanges = ['AI1', 'CI1', 'IC1', 'NC1', 'CI2', 'NC2'] as any[];
        if (action.exchange && exchanges.indexOf(action.exchange)) {
          exchanges.push(exchanges.indexOf(action.exchange));
        } else {
          exchanges.push(0);
        }

        popup.addPopupRow('dropdown', 'Exchange', exchanges, undefined, undefined);

        // Add row for editing price limits (will generate a popup on top of the other popup)
        popup.addPopupRow('button', 'Price Limits', 'EDIT', undefined, () => {
          const pricePopup = new Popup(thisObj.tile, 'Price Limit Editor', 51);

          // Create rows corresponding to current materials stored in action price limit
          let numMaterials = 0; // Stores how many materials there are listed
          if (action.priceLimits) {
            Object.keys(action.priceLimits).forEach(mat => {
              pricePopup.addPopupRow(
                'text',
                `Material Ticker #${(numMaterials + 1).toLocaleString()}`,
                mat,
                undefined,
                undefined,
              );
              pricePopup.addPopupRow(
                'number',
                `Price Limit #${(numMaterials + 1).toLocaleString()}`,
                action.priceLimits[mat],
                undefined,
                undefined,
              );
              numMaterials++;
            });
          }

          // Row for adding more material rows above
          pricePopup.addPopupRow(
            'button',
            'Add Material',
            'ADD',
            'Add a new material to enter a price limit for.',
            () => {
              const newMatRow = pricePopup.addPopupRow(
                'text',
                `Material Ticker #${(numMaterials + 1).toLocaleString()}`,
                undefined,
                undefined,
                undefined,
              );
              const newAmtRow = pricePopup.addPopupRow(
                'number',
                `Price Limit #${(numMaterials + 1).toLocaleString()}`,
                undefined,
                undefined,
                undefined,
              );
              numMaterials++;

              // Move rows above save rows
              pricePopup.form.insertBefore(
                newMatRow.row,
                pricePopup.form.children[pricePopup.form.children.length - 4],
              );
              pricePopup.form.insertBefore(
                newAmtRow.row,
                pricePopup.form.children[pricePopup.form.children.length - 3],
              );
            },
          );

          // Add save row
          pricePopup.addPopupRow('button', 'CMD', 'SAVE', undefined, () => {
            action.priceLimits = {};

            const numMaterials = (pricePopup.rows.length - 2) / 2;
            // Loop through the rows and extract the materials and amounts
            for (let i = 1; i <= numMaterials; i++) {
              const matRow = pricePopup.getRowByName(`Material Ticker #${i.toLocaleString()}`);
              const amtRow = pricePopup.getRowByName(`Price Limit #${i.toLocaleString()}`);
              const mat = matRow.rowInput.value;
              const priceLim = parseFloat(amtRow.rowInput.value);

              if (mat && mat != '' && priceLim && !isNaN(priceLim) && priceLim > 0) {
                action.priceLimits[mat] = priceLim;
              }
            }

            pricePopup.destroy();
          });
        });

        // Add row for buying partial
        popup.addPopupRow(
          'checkbox',
          'Buy Partial',
          action.buyPartial,
          'Whether the action will be taken if there is not enough stock on the CX.',
          undefined,
        );

        // Add row for using CX inventory
        popup.addPopupRow(
          'checkbox',
          'Use CX Inventory',
          action.useCXInv == undefined ? true : action.useCXInv,
          'Whether to use stock in the CX warehouse when calculating how much needs to be bought.',
          undefined,
        );
        break;
      }
    }

    // Add row to save and corresponding function
    popup.addPopupRow('button', 'CMD', 'SAVE', undefined, () => {
      const nameRow = popup.getRowByName('Name');
      const name = nameRow.rowInput.value;

      if (name && name != '') {
        action.name = name;

        switch (action.type) {
          case 'CX Buy':
            action.group = popup.getRowByName('Material Group').rowInput.value;
            action.exchange = popup.getRowByName('Exchange').rowInput.value;
            action.buyPartial = popup.getRowByName('Buy Partial').rowInput.checked;
            action.useCXInv = popup.getRowByName('Use CX Inventory').rowInput.checked;
            break;
        }
        popup.destroy();
        thisObj.generateActionForm();
      } // If no valid name, throw an error
      else {
        nameRow.row.classList.add(...Style.FormError);
      }
    });
  }

  // Create save button at bottom of interface
  private generateSaveForm() {
    const thisObj = this; // A way to pass this into subsequent functions like action listeners
    if (!this.saveSection) {
      this.saveSection = document.createElement('div');
      this.tile.appendChild(this.saveSection);
    } else {
      clearChildren(this.saveSection);
    }

    const sectionTitle = document.createElement('h3');
    sectionTitle.classList.add(...Style.SidebarSectionHead);
    sectionTitle.textContent = 'CMDS';
    this.saveSection.appendChild(sectionTitle);

    // Add save button
    const saveButton = this.createFormRow(
      this.saveSection,
      'button',
      'command',
      'Save',
      'saveButton',
      'SAVE',
    );

    // Add action listener to save button
    saveButton.addEventListener('click', async () => {
      // Get stored values
      const storageValue = await getLocalStoragePromise('PMMG-Action');
      const storedActions = storageValue['PMMG-Action'] || {};

      // Store the current values
      if (thisObj.globalAttributes.name) {
        // Remove old action package under previous name to prevent proliferation with name changes
        storedActions[thisObj.globalAttributes.name] = undefined;
      }
      const actionPackage = {
        groups: thisObj.groups,
        actions: thisObj.actions,
        global: thisObj.globalAttributes,
      };
      storedActions[thisObj.globalAttributes.name] = actionPackage;
      setSettings({ 'PMMG-Action': storedActions });

      // Update the screen and show success
      thisObj.generateGlobalForm();
      showSuccessDialog(thisObj.tile);
    });

    // Add open button
    const openButton = this.createFormRow(
      this.saveSection,
      'button',
      'command',
      'Open',
      'openButton',
      'OPEN',
    );
    openButton.addEventListener('click', () => {
      showBuffer(`XIT ACTION_${thisObj.globalAttributes.name.split(' ').join('_')}`);
    });

    // Add help button
    const helpButton = this.createFormRow(
      this.saveSection,
      'button',
      'command',
      'Help',
      'helpButton',
      'HELP',
    );
    helpButton.addEventListener('click', () => {
      showBuffer('XIT HELP_ACTION');
    });
  }

  // Creates a new form style row. Returns the input element, automatically adding the whole row to the "parent" element.
  // rowType: "text", "number", "label", "checkbox", "select", "button"; Determines what type of input the row has
  // rowColorType: "active", "command", "passive"; Determines the color of the row. Normal yellow input is "active"
  private createFormRow(parent, rowType, rowColorType, labelText, inputName, value, params?) {
    const row = document.createElement('div');
    parent.appendChild(row);
    switch (rowColorType) {
      case 'active':
        row.classList.add(...Style.FormRow);
        break;
      case 'command':
        row.classList.add(...Style.FormSaveRow);
        break;
      case 'passive':
        row.classList.add(...Style.HeaderRow);
        break;
    }

    const label = document.createElement('label'); // Label for the row
    label.classList.add(...Style.FormLabel);
    label.appendChild(createTextSpan(labelText));
    row.appendChild(label);

    const inputDiv = document.createElement('div'); // Space where the input is placed
    inputDiv.classList.add(...Style.FormInput);
    row.appendChild(inputDiv);

    const inputSubDiv = document.createElement('div'); // Intermediate div containing the input element
    inputSubDiv.classList.add(...Style.FormInputDiv);
    inputDiv.appendChild(inputSubDiv);

    let inputElem;
    switch (rowType) {
      case 'label':
        inputElem = document.createElement('div');
        inputSubDiv.appendChild(inputElem);
        inputElem.textContent = value;
        inputElem.classList.add(...Style.FormPassiveLabel);
        break;
      case 'text':
        inputElem = document.createElement('input');
        inputElem.style.textAlign = 'left';
        inputSubDiv.appendChild(inputElem);
        if (value) {
          inputElem.value = value;
        }
        if (params) {
          inputElem.placeholder = params;
        }
        inputElem.name = inputName;
        break;
      case 'number':
        inputElem = document.createElement('input');
        inputElem.style.textAlign = 'left';
        inputElem.type = 'number';
        inputSubDiv.appendChild(inputElem);
        if (value) {
          inputElem.value = value;
        }
        if (params) {
          inputElem.placeholder = params;
        }
        inputElem.name = inputName;
        break;
      case 'checkbox':
        inputElem = document.createElement('input');
        inputElem.type = 'checkbox';
        inputSubDiv.appendChild(inputElem);
        if (value) {
          inputElem.value = value;
        }
        if (params) {
          inputElem.placeholder = params;
        }
        inputElem.name = inputName;
        break;
      case 'select':
        inputElem = document.createElement('select');
        inputElem.style.width = '170.4px';
        inputSubDiv.appendChild(inputElem);
        if (params) {
          params.forEach(option => {
            const optionElem = document.createElement('option');
            inputElem.appendChild(optionElem);
            optionElem.value = option;
            optionElem.textContent = option;
          });

          if (value) {
            inputElem.value = value;
          }
        }
        inputElem.name = inputName;
        break;
      case 'button':
        inputElem = document.createElement('button');
        inputSubDiv.appendChild(inputElem);
        inputElem.textContent = value;
        inputElem.classList.add(...Style.Button);
        inputElem.classList.add(...Style.ButtonPrimary);
        break;
    }
    return inputElem;
  }
}

// All functions associated with actually executing an action package as a command package

// Turn stored action package (resupply base for 30 days) to series of actionable actions (buy 1000 RAT, then 1000 DW, etc)
function parseActionPackage(rawActionPackage, messageBox) {
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
        CXInvs[ticker][mat.quantity.material.ticker] = mat.quantity.amount;
      });
    }
  });

  rawActionPackage.actions.forEach(action => {
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
      Object.keys(parsedGroup).forEach(mat => {
        const cxTicker = `${mat}.${action.exchange}`;
        let amount = parsedGroup[mat];

        const orderBook = cxobStore.getByTicker(cxTicker);
        if (orderBook && Date.now() - orderBook.timestamp < 900000) {
          // Check for existance and timestamp of data
          if (orderBook.sellingOrders.length == 0) {
            // No orders
            if (action.buyPartial) {
              return; // Just ignore this one if we're fine with buying partial
            }
            addMessage(messageBox, `Error: No orders on ${cxTicker}`);
            error = true;
            return;
          }

          let remaining = parsedGroup[mat];
          let price;
          // Iterate through the orders to find the price to set to to buy it all
          for (let i = 0; i < orderBook.sellingOrders.length; i++) {
            if (
              (!action.priceLimits ||
                !action.priceLimits[mat] ||
                action.priceLimits[mat] > orderBook.sellingOrders[i].limit.amount) &&
              orderBook.sellingOrders[i].amount > remaining
            ) {
              // This order will be the filling one
              price = orderBook.sellingOrders[i].limit.amount;
              break;
            } else {
              if (
                (!action.priceLimits ||
                  !action.priceLimits[mat] ||
                  action.priceLimits[mat] > orderBook.sellingOrders[i].limit.amount) &&
                !orderBook.sellingOrders[i].amount
              ) {
                // Only MMs will not have an amount attached
                price = orderBook.sellingOrders[i].limit.amount;
                break;
              }
              remaining -= orderBook.sellingOrders[i].amount; // Otherwise subtract the amount of that order from the amount remaining and continue
            }
          }

          // Check against price limit
          if (
            action.priceLimits &&
            action.priceLimits[mat] &&
            price > action.priceLimits[mat] &&
            !action.buyPartial
          ) {
            addMessage(messageBox, `Error: Price above limit on ${cxTicker}`);
            error = true;
            return;
          }
          if (action.priceLimits && action.priceLimits[mat] && isNaN(action.priceLimits[mat])) {
            addMessage(messageBox, `Error: Non-numerical price limit on ${cxTicker}`);
            error = true;
            return;
          }

          if (!price && !action.buyPartial) {
            // Not enough to buy it all
            addMessage(messageBox, `Error: Not enough materials on ${cxTicker}`);
            error = true;
            return;
          } else if (
            !price &&
            (!action.priceLimits || !action.priceLimits[mat]) &&
            orderBook.supply > 0
          ) {
            // If fine with buying partial, buy the entire stock
            price = orderBook.sellingOrders[orderBook.sellingOrders.length - 1].limit.amount;
            amount = orderBook.supply;
          } else if (!price && action.priceLimits && action.priceLimits[mat]) {
            return; // If there is no price, but buying partial, don't care and exit
          }

          // Now create action item
          const actionItem = {
            type: 'CXBuy',
            buffer: `CXPO ${cxTicker}`,
            parameters: {
              amount,
              priceLimit: price,
            },
          };
          actionPackage.push(actionItem);
        } else {
          addMessage(messageBox, `Error: Stale/missing data on ${cxTicker}`);
          error = true;
        }
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
function parseGroup(group, messageBox, errorFlag) {
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

    const site = sitesStore.getByPlanetName(group.planet);
    const planetWorkforce = workforcesStore.getById(site?.siteId)?.workforces;
    const planetProduction = productionStore.getBySiteId(site?.siteId);
    const planetInv = storagesStore.getByAddress(site?.siteId);

    if (planetProduction && planetWorkforce && planetInv) {
      const planetBurn = calculatePlanetBurn(planetProduction, planetWorkforce, planetInv); // The planet burn data

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

    const planetSite = sitesStore.getByPlanetName(group.planet);

    if (planetSite && planetSite.platforms) {
      planetSite.platforms.forEach(building => {
        if (NonProductionBuildings.includes(building.module.reactorTicker)) {
          return;
        }

        const date = (new Date().getTime() - getBuildingLastRepair(building)) / 86400000;

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

async function createExecuteScreen(tile, packageName) {
  const title = document.createElement('h2');
  title.textContent = packageName;
  title.classList.add(...Style.DraftName);
  title.style.marginLeft = '5px';
  tile.appendChild(title);

  const storageValue = await getLocalStoragePromise('PMMG-Action');
  const storedActions = storageValue['PMMG-Action'] || {};

  const rawActionPackage = storedActions[packageName];

  // Create message box
  const messageBox = document.createElement('textarea');
  messageBox.classList.add('pb-read-textarea');
  messageBox.readOnly = true;
  tile.appendChild(messageBox);

  if (!rawActionPackage) {
    addMessage(
      messageBox,
      `Error: No action package detected. Open XIT ACTION_GEN_${packageName.split(' ').join('_')} to create one`,
    );
    return;
  }

  // Create basic buffer structure

  // Create array of "View", "Validate", "Execute" buttons
  const startButtons = document.createElement('div');
  startButtons.style.marginLeft = '5px';
  startButtons.style.marginTop = '5px';
  tile.appendChild(startButtons);
  const viewButton = document.createElement('button');
  viewButton.classList.add(...Style.Button);
  viewButton.classList.add(...Style.ButtonPrimary);
  viewButton.textContent = 'VIEW';
  startButtons.appendChild(viewButton);
  const validateButton = document.createElement('button');
  validateButton.classList.add(...Style.Button);
  validateButton.classList.add(...Style.ButtonPrimary);
  validateButton.textContent = 'VALIDATE';
  startButtons.appendChild(validateButton);
  const executeButton = document.createElement('button');
  executeButton.classList.add(...Style.Button);
  executeButton.classList.add(...Style.ButtonPrimary);
  executeButton.textContent = 'EXECUTE';
  startButtons.appendChild(executeButton);

  let executionIndex = 0; // Index of which action is being executed

  // Add action listener for viewing
  viewButton.addEventListener('click', () => {
    addMessage(messageBox, '', true);
    const actionPackage = parseActionPackage(rawActionPackage, messageBox);
    actionPackage.forEach(action => {
      addMessage(messageBox, generatePrettyName(action));
    });

    if (actionPackage.length == 0) {
      addMessage(messageBox, 'Error: No actions generated');
    }
  });

  // Add action listener for validation
  validateButton.addEventListener('click', () => {
    addMessage(messageBox, '', true);
    const actionPackage = parseActionPackage(rawActionPackage, messageBox);
    if (actionPackage.valid) {
      validateAction(actionPackage, messageBox);
    }
  });

  // Execute the action!
  executeButton.addEventListener('click', async () => {
    addMessage(messageBox, '', true);
    // Check validation
    const actionPackage = parseActionPackage(rawActionPackage, messageBox);
    const valid = actionPackage.valid && validateAction(actionPackage, messageBox);
    if (!valid) {
      return;
    }

    // Create set of controls/info associated with execution
    const executionInfo = document.createElement('div');
    tile.appendChild(executionInfo);

    // Create area where current action is listed
    const currentActionDiv = document.createElement('div');
    currentActionDiv.style.marginLeft = '5px';
    currentActionDiv.style.marginTop = '5px';
    const currentAction = createTextSpan('Awaiting First Action');
    currentActionDiv.appendChild(currentAction);
    executionInfo.appendChild(currentActionDiv);

    // Create execution controls (this is where the button to click will be moved)
    const executeControls = document.createElement('div');
    executeControls.style.marginLeft = '5px';
    executeControls.style.marginTop = '5px';
    executionInfo.appendChild(executeControls);
    const skipButton = document.createElement('button');
    skipButton.classList.add(...Style.Button);
    skipButton.classList.add(...Style.ButtonPrimary);
    skipButton.textContent = 'SKIP';
    executeControls.appendChild(skipButton);
    const cancelButton = document.createElement('button');
    cancelButton.classList.add(...Style.Button);
    cancelButton.classList.add(...Style.ButtonDanger);
    cancelButton.textContent = 'CANCEL';
    executeControls.appendChild(cancelButton);

    // Begin executing actions
    executionIndex = 0;

    // [{"type": "transferMaterialSet", "buffer": "MTRA", "parameters": {"source": "Base - Antares II - Deimos", "target": "Warehouse - Antares II - Deimos"}}]
    executeAction(
      actionPackage,
      executionIndex,
      messageBox,
      executionInfo,
      tile,
      skipButton,
      cancelButton,
      currentAction,
    );
  });

  return;
}

function addMessage(messageBox, message, clear?) {
  messageBox.textContent = clear
    ? message
    : message + (messageBox.textContent == '' ? '' : '\n') + messageBox.textContent;
}

function validateAction(actionPackage, messageBox) {
  if (actionPackage.length == 0) {
    addMessage(messageBox, 'Error: No actions generated');
    return false;
  }
  // Gets all buffers
  const bufferDivs = getBuffers('');
  const buffers = [] as any[];
  bufferDivs.forEach(buffer => {
    const header = buffer.querySelector(Selector.BufferHeader);
    if (!header) {
      return;
    }

    const parameters = header.textContent;

    buffers.push([parameters, buffer]);
  });
  let valid = true;
  actionPackage.forEach(action => {
    if (!action.type) {
      valid = false;
      addMessage(messageBox, 'Error: Action Type Missing');
    }
    if (!action.buffer) {
      valid = false;
      addMessage(messageBox, 'Error: Buffer Not Specified');
    } else {
      const matchingBuffers = getBuffersFromList(action.buffer, buffers);
      if (matchingBuffers.length == 0) {
        valid = false;
        addMessage(messageBox, `Error: Missing Buffer ${action.buffer}`);
      }
    }

    switch (action.type) {
      case 'CXBuy':
        if (!action.parameters || !action.parameters.amount || !action.parameters.priceLimit) {
          valid = false;
          addMessage(messageBox, `Error: Missing parameters on ${action.buffer}`);
        }
        break;
      default:
        valid = false;
        addMessage(messageBox, 'Error: Unrecognized action type');
    }
  });

  if (valid) {
    addMessage(messageBox, 'Successfully validated');
  }

  return valid;
}

function executeAction(
  actionPackage,
  executionIndex,
  messageBox,
  executionInfo,
  tile,
  skipButton,
  cancelButton,
  currentAction,
) {
  const action = actionPackage[executionIndex];
  if (!action || !action.type || !action.buffer || !action.parameters) {
    addMessage(messageBox, 'Error: Invalid action format');
    tile.removeChild(executionInfo);
    return;
  }

  const relevantBuffers = getBuffers(action.buffer);

  // Create name for action to show
  const actionName = generatePrettyName(action);
  currentAction.textContent = actionName;

  // Check buffer exists
  if (!relevantBuffers[0]) {
    addMessage(messageBox, `Error: No buffer found executing: ${actionName}`);
    tile.removeChild(executionInfo);
    return;
  }

  const buffer = relevantBuffers[0];

  // Find button to move
  let button;
  let buttonOffset = 0;
  const resetStyles = function (elem) {
    return elem;
  }; // Function to reset any extra styles on the element besides the ones used in moving it
  switch (action.type) {
    case 'CXBuy':
      button = buffer.querySelector(Selector.ButtonSuccess);
      buttonOffset = 27;
      break;
    case 'transferMaterialSet':
      button = buffer.querySelector(Selector.MaterialSelector); // The text box the user must click before the material is auto-selected
      buttonOffset = -104;

      // Format textbox to obfuscate what it is and make clicking it clear

      break;
  }

  if (!button) {
    addMessage(messageBox, `Error: No button found executing: ${actionName}`);
    tile.removeChild(executionInfo);
    return;
  }

  // Move button
  button.style.position = 'fixed';
  button.style.zIndex = '12000';
  buffer.style.isolation = 'auto';
  const rect = cancelButton.getBoundingClientRect();
  button.style.left = `${(rect.left + window.scrollX + button.offsetWidth + buttonOffset).toString()}px`;
  button.style.top = `${(rect.top + window.scrollY).toString()}px`;

  // Fill in fields/modify buffer
  switch (action.type) {
    case 'CXBuy': {
      // Get all the inputs on the buffer and assign them accordingly. There has to be a better way to do this.
      const inputs = buffer.querySelectorAll('input');
      const quantityInput = inputs[0];
      const priceInput = inputs[1];

      if (!quantityInput || !priceInput) {
        undoButtonMove(button, resetStyles);
        addMessage(messageBox, `Error: Missing fields executing: ${actionName}`);
        tile.removeChild(executionInfo);
        return;
      }
      if (!action.parameters.amount || !action.parameters.priceLimit) {
        undoButtonMove(button, resetStyles);
        addMessage(messageBox, `Error: Missing parameters executing: ${actionName}`);
        tile.removeChild(executionInfo);
        return;
      }
      changeValue(quantityInput, action.parameters.amount.toString());
      changeValue(priceInput, action.parameters.priceLimit.toString());
      break;
    }
    case 'transferMaterialSet': {
      // Get and set relevant inputs on the buffer
      const sourceSelect = buffer.querySelector(Selector.StoreSelect) as HTMLSelectElement;

      if (!sourceSelect) {
        undoButtonMove(button, resetStyles);
        addMessage(messageBox, `Error: Missing fields executing: ${actionName}`);
        tile.removeChild(executionInfo);
        return;
      }
      if (!action.parameters.source || !action.parameters.target) {
        undoButtonMove(button, resetStyles);
        addMessage(messageBox, `Error: Missing parameters executing: ${actionName}`);
        tile.removeChild(executionInfo);
        return;
      }

      // Select correct source inventory
      sourceSelect.click();
      let sourceID;
      (Array.from(sourceSelect.children) as HTMLOptionElement[]).forEach(child => {
        if (child.textContent == action.parameters.source) {
          sourceID = child.value;
          child.click();
        }
      });

      if (!sourceID) {
        // Source not found
        undoButtonMove(button, resetStyles);
        addMessage(messageBox, `Error: Source inventory not found executing: ${actionName}`);
        tile.removeChild(executionInfo);
        return;
      }

      //changeSelectValue(sourceSelect, sourceID);
      break;
    }
  }

  // Add listener to the button to start waiting for feedback. Then move button back and go to next action
  const buttonListener = function () {
    // If a popup is present, don't take any actions
    if (buffer.querySelector(Selector.ActionFeedback)) {
      addMessage(messageBox, 'Error: Popup exists on buffer');
      return;
    }
    // Have to wait for "success" or "failure" screen
    button.disabled = true;
    button.style.cursor = 'not-allowed';

    // Add mutation listener to wait
    monitorStatus(buffer, dismissButton => {
      // Detect success
      const success = buffer.querySelector(Selector.ActionSuccess);
      button.disabled = false; // Reenable the button regardless of what happens
      button.style.cursor = 'pointer';

      if (success) {
        // If successful...
        // Put button back to where it was, dismiss success screen
        button.removeEventListener('click', buttonListener);
        skipButton.removeEventListener('click', skipButtonListener);
        cancelButton.removeEventListener('click', cancelButtonListener);
        undoButtonMove(button, resetStyles);
        dismissButton.click();
        addMessage(messageBox, `Successfully executed: ${actionName}`);

        // If at end of list, don't repeat
        if (executionIndex + 1 >= actionPackage.length) {
          tile.removeChild(executionInfo);
          addMessage(messageBox, 'Successfully executed action package');
          showSuccessDialog(tile, 'Action Package Successfully Executed!');
        } // Otherwise, increment and repeat
        else {
          executionIndex++;
          executeAction(
            actionPackage,
            executionIndex,
            messageBox,
            executionInfo,
            tile,
            skipButton,
            cancelButton,
            currentAction,
          );
        }
      } else {
        const feedback =
          buffer.querySelector(Selector.ActionFeedbackMain) ||
          buffer.querySelector(Selector.ActionConfirmationMessage);
        if (!feedback || !feedback.textContent) {
          addMessage(messageBox, 'Error: An error was encountered but could not be read');
        } else {
          addMessage(messageBox, `Error: ${feedback.textContent}`);
        }
      }
    });
  };
  button.removeEventListener('click', buttonListener); // Remove previous listeners
  button.addEventListener('click', buttonListener);

  // Tackle skip button
  const skipButtonListener = function () {
    // Skip the current instruction (putting buttons back where they should be)
    button.removeEventListener('click', buttonListener); // Remove previous listeners
    skipButton.removeEventListener('click', skipButtonListener);
    cancelButton.removeEventListener('click', cancelButtonListener);
    undoButtonMove(button, resetStyles);
    addMessage(messageBox, `Skipped: ${actionName}`);

    // If at end of list, don't repeat
    if (executionIndex + 1 >= actionPackage.length) {
      tile.removeChild(executionInfo);
      addMessage(messageBox, 'Successfully executed action package');
      showSuccessDialog(tile, 'Action Package Successfully Executed!');
    } // Otherwise, increment and repeat
    else {
      executionIndex++;
      executeAction(
        actionPackage,
        executionIndex,
        messageBox,
        executionInfo,
        tile,
        skipButton,
        cancelButton,
        currentAction,
      );
    }
  };
  skipButton.removeEventListener('click', skipButtonListener);
  skipButton.addEventListener('click', skipButtonListener);

  // Tackle cancel button
  const cancelButtonListener = function () {
    // Cancel all instructions (putting buttons back where they should be)
    button.removeEventListener('click', buttonListener); // Remove previous listeners
    skipButton.removeEventListener('click', skipButtonListener);
    cancelButton.removeEventListener('click', cancelButtonListener);
    undoButtonMove(button, resetStyles);
    addMessage(messageBox, 'Canceled action package');
    tile.removeChild(executionInfo);
  };
  cancelButton.removeEventListener('click', cancelButtonListener);
  cancelButton.addEventListener('click', cancelButtonListener);
}

function undoButtonMove(button, resetStyles) {
  button.style.position = 'relative';
  button.style.left = 'auto';
  button.style.top = 'auto';
  button.style.zIndex = 'auto';
  resetStyles(button);
}

// Monitor for success/failure in action
function monitorStatus(buffer, callback) {
  const onMutationsObserved = function () {
    const dismiss =
      buffer.querySelector(Selector.ActionDismiss) ||
      buffer.querySelector(Selector.ActionConfirmation);
    if (dismiss) {
      observer.disconnect();
      callback(dismiss);
    }
    return;
  };

  const target = buffer;
  const config = { childList: true, subtree: true };
  const MutationObserver = window['MutationObserver'] || window['WebKitMutationObserver'];
  const observer = new MutationObserver(onMutationsObserved);
  observer.observe(target, config);
}

// Generate a pretty name to be displayed
function generatePrettyName(action) {
  let name = '';

  switch (action.type) {
    case 'CXBuy': {
      const matches = action.buffer.match(/CXPO ([A-Za-z0-9]{1,3})\.([A-Za-z0-9]{3})/);
      if (matches && matches[1] && matches[2]) {
        name = `Buy ${action.parameters.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${
          matches[1]
        } from ${matches[2]} for ${action.parameters.priceLimit.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}/u`;
      }
      break;
    }
  }

  return name;
}

xit.add({
  command: ['ACT', 'ACTION'],
  name: parameters => {
    if (parameters.length === 0) {
      return 'ACTION PACKAGES';
    }
    if (parameters[1].toUpperCase() == 'GEN') {
      return 'GENERATE ACTION PACKAGE';
    }
    return 'EXECUTE ACTION PACKAGE';
  },
  module: Execute,
});
