import {
  clearChildren,
  createEmptyTableRow,
  createTable,
  createTextSpan,
  Popup,
  showWarningDialog,
} from '@src/util';
import { comparePlanets } from '@src/util';
import { Style } from '@src/Style';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { createId } from '@src/store/create-id';
import { userData } from '@src/store/user-data';
import { parseStorageName } from '@src/features/XIT/ACT/utils';

// All functions associated with generating/editing action packages
export async function createGenerateScreen(tile, packageName) {
  if (!packageName || packageName == '') {
    tile.textContent = 'Error: Please name the action package by including an extra parameter';
    return;
  }

  let actionPackage = userData.actionPackages.find(x => x.global?.name === packageName);

  if (!actionPackage) {
    actionPackage = { id: createId(), global: { name: packageName }, groups: [], actions: [] };
    userData.actionPackages.push(actionPackage);
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
  public actionPackage: UserData.ActionPackage;

  constructor(tile, actionPackage: UserData.ActionPackage) {
    this.tile = tile;
    this.actionPackage = actionPackage;

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
    title.textContent = this.actionPackage.global.name || 'unnamed';
    title.classList.add(...Style.DraftName);
    title.style.marginLeft = '4px';
    this.globalSection.appendChild(title);
  }

  // Generate the form for groups
  private generateGroupForm() {
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
    if (this.actionPackage.groups.length == 0) {
      groupTable.appendChild(createEmptyTableRow(4, 'No groups found. Click add below'));
    }
    // Populate table otherwise
    for (const group of this.actionPackage.groups) {
      const groupIndex = this.actionPackage.groups.indexOf(group);
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
            for (const mat of Object.keys(group.materials)) {
              contentText +=
                group.materials[mat].toLocaleString(undefined, { maximumFractionDigits: 0 }) +
                ' ' +
                mat +
                ', ';
            }
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
                ? ' older than ' + group.days + ' day' + (group.days == 1 ? ' ' : 's ')
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
          this.tile,
          'Are you sure you want to delete this group?',
          'Confirm',
          () => {
            this.actionPackage.groups.splice(groupIndex, 1);
            this.generateGroupForm();
          },
        );
      });

      // Add edit button functionality
      editButton.addEventListener('click', () => {
        this.createGroupPopup(groupIndex);
      });

      groupTable.appendChild(row);
    }

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
      this.actionPackage.groups.push({ type: newGroupDropdown.value });
      this.generateGroupForm();
    });
  }

  // Create the oppup interface for editing a material group
  private createGroupPopup(groupIndex) {
    const group = this.actionPackage.groups[groupIndex];

    // Popup object for inputting group parameters
    const popup = new Popup(this.tile, 'Material Group Editor');

    // Add row to enter name
    popup.addPopupRow('text', 'Name', group.name, undefined, undefined);

    // Add other rows depending on the group type
    switch (group.type) {
      case 'Resupply': {
        // Get list of planets
        const possiblePlanets = [] as string[];
        for (const workforce of workforcesStore.all.value ?? []) {
          possiblePlanets.push(getEntityNameFromAddress(workforce.address)!);
        }

        possiblePlanets.sort(comparePlanets);

        // Add index of selected option to end of list because of poor design decisions in popup class
        if (group.planet && possiblePlanets.indexOf(group.planet)) {
          possiblePlanets.push(possiblePlanets.indexOf(group.planet) as unknown as string);
        } else {
          possiblePlanets.push(0 as unknown as string);
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
        popup.addPopupRow(
          'checkbox',
          'Workforce Only',
          group.consumablesOnly == undefined ? false : group.consumablesOnly,
          'Whether to limit the materials in the group to workforce consumables only',
          undefined,
        );
        break;
      }
      case 'Repair': {
        // Get list of planets
        const possiblePlanets = [] as string[];
        for (const site of sitesStore.all.value ?? []) {
          possiblePlanets.push(getEntityNameFromAddress(site.address)!);
        }

        possiblePlanets.sort(comparePlanets);

        // Add index of selected option to end of list because of poor design decisions in popup class
        if (group.planet && possiblePlanets.indexOf(group.planet)) {
          possiblePlanets.push(possiblePlanets.indexOf(group.planet) as unknown as string);
        } else {
          possiblePlanets.push(0 as unknown as string);
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
          for (const mat of Object.keys(group.materials)) {
            popup.addPopupRow(
              'text',
              'Material Ticker #' + (numMaterials + 1).toLocaleString(),
              mat,
              undefined,
              undefined,
            );
            popup.addPopupRow(
              'number',
              'Material Amount #' + (numMaterials + 1).toLocaleString(),
              group.materials[mat],
              undefined,
              undefined,
            );
            numMaterials++;
          }
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
              'Material Ticker #' + (numMaterials + 1).toLocaleString(),
              undefined,
              undefined,
              undefined,
            );
            const newAmtRow = popup.addPopupRow(
              'number',
              'Material Amount #' + (numMaterials + 1).toLocaleString(),
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
            group.consumablesOnly = popup.getRowByName('Workforce Only').rowInput.checked;
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
              const matRow = popup.getRowByName('Material Ticker #' + i.toLocaleString());
              const amtRow = popup.getRowByName('Material Amount #' + i.toLocaleString());
              const mat = matRow.rowInput.value;
              const matAmt = parseInt(amtRow.rowInput.value);

              if (mat && mat != '' && matAmt && !isNaN(matAmt) && matAmt > 0) {
                group.materials[mat] = matAmt;
              }
            }
            break;
          }
        }
        popup.destroy();
        this.generateGroupForm();
      } // If no valid name, throw an error
      else {
        nameRow.row.classList.add(...Style.FormError);
      }
    });
  }

  // Generate the form for actions
  private generateActionForm() {
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
    if (this.actionPackage.actions.length == 0) {
      actionTable.appendChild(createEmptyTableRow(4, 'No actions found. Click add below'));
    }

    // Populate table
    for (let i = 0; i < this.actionPackage.actions.length; i++) {
      const action = this.actionPackage.actions[i];
      const actionIndex = i;
      // Create row
      const row = document.createElement('tr');

      /*	// No move buttons for now while there is only one type of action
			// Create moving up/down button
			const moveColumn = document.createElement("td");
			moveColumn.style.width = "48.5px";
			row.appendChild(moveColumn);
			*/

      // Column stating the type of the group on the row. "CX Buy", "MTRA"
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
              createTextSpan('Buying group ' + action.group + ' from ' + action.exchange),
            );
          } else {
            contentColumn.appendChild(createTextSpan('--'));
          }
          break;
        case 'MTRA':
          if (action.group && action.origin && action.dest) {
            const origin =
              action.origin == 'Configure on Execution' ? 'configured location' : action.origin;
            const dest =
              action.dest == 'Configure on Execution' ? 'configured location' : action.dest;

            contentColumn.appendChild(
              createTextSpan('Transfer group ' + action.group + ' from ' + origin + ' to ' + dest),
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
          this.tile,
          'Are you sure you want to delete this action?',
          'Confirm',
          () => {
            this.actionPackage.actions.splice(actionIndex, 1);
            this.generateActionForm();
          },
        );
      });

      // Add edit button functionality
      editButton.addEventListener('click', () => {
        this.createActionPopup(actionIndex);
      });

      actionTable.appendChild(row);
    }

    // Dropdown for adding new groups
    const newActionDropdown = this.createFormRow(
      this.actionSection,
      'select',
      'active',
      'Action Type',
      'actionType',
      undefined,
      ['CX Buy', 'MTRA'],
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
      this.actionPackage.actions.push({ type: newActionDropdown.value });
      this.generateActionForm();
    });
  }

  // Create the oppup interface for editing an action
  private createActionPopup(actionIndex) {
    const action = this.actionPackage.actions[actionIndex];

    // Popup object for inputting group parameters
    const popup = new Popup(this.tile, 'Action Editor');

    // Add row to enter name
    popup.addPopupRow('text', 'Name', action.name, undefined, undefined);

    // Add more rows depending on the type of the action
    switch (action.type) {
      case 'CX Buy': {
        // Add group dropdown
        const groupNames = this.actionPackage.groups
          .filter(obj => obj.name && obj.name !== '')
          .map(obj => obj.name);
        // Add index of selected option to end of list because of poor design decisions in popup class
        if (action.group && groupNames.indexOf(action.group)) {
          groupNames.push(groupNames.indexOf(action.group) as unknown as string);
        } else {
          groupNames.push(0 as unknown as string);
        }

        popup.addPopupRow('dropdown', 'Material Group', groupNames, undefined, undefined);

        // Add exchanges dropdown
        // Add index of selected option to end of list because of poor design decisions in popup class
        const exchanges = ['AI1', 'CI1', 'IC1', 'NC1', 'CI2', 'NC2'];
        if (action.exchange && exchanges.indexOf(action.exchange)) {
          exchanges.push(exchanges.indexOf(action.exchange) as unknown as string);
        } else {
          exchanges.push(0 as unknown as string);
        }

        popup.addPopupRow('dropdown', 'Exchange', exchanges, undefined, undefined);

        // Add row for editing price limits (will generate a popup on top of the other popup)
        popup.addPopupRow('button', 'Price Limits', 'EDIT', undefined, () => {
          const pricePopup = new Popup(this.tile, 'Price Limit Editor', 51);

          // Create rows corresponding to current materials stored in action price limit
          let numMaterials = 0; // Stores how many materials there are listed
          if (action.priceLimits) {
            for (const mat of Object.keys(action.priceLimits)) {
              pricePopup.addPopupRow(
                'text',
                'Material Ticker #' + (numMaterials + 1).toLocaleString(),
                mat,
                undefined,
                undefined,
              );
              pricePopup.addPopupRow(
                'number',
                'Price Limit #' + (numMaterials + 1).toLocaleString(),
                action.priceLimits[mat],
                undefined,
                undefined,
              );
              numMaterials++;
            }
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
                'Material Ticker #' + (numMaterials + 1).toLocaleString(),
                undefined,
                undefined,
                undefined,
              );
              const newAmtRow = pricePopup.addPopupRow(
                'number',
                'Price Limit #' + (numMaterials + 1).toLocaleString(),
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
              const matRow = pricePopup.getRowByName('Material Ticker #' + i.toLocaleString());
              const amtRow = pricePopup.getRowByName('Price Limit #' + i.toLocaleString());
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

      case 'MTRA': {
        // Add group dropdown
        const groupNames = this.actionPackage.groups
          .filter(obj => obj.name && obj.name !== '')
          .map(obj => obj.name);
        // Add index of selected option to end of list because of poor design decisions in popup class
        if (action.group && groupNames.indexOf(action.group)) {
          groupNames.push(groupNames.indexOf(action.group) as unknown as string);
        } else {
          groupNames.push(0 as unknown as string);
        }

        popup.addPopupRow('dropdown', 'Material Group', groupNames, undefined, undefined);

        // Generate list of inventories
        const originNames = [...(storagesStore.all.value ?? [])]
          .sort(storageSort)
          .map(parseStorageName);

        originNames.unshift('Configure on Execution');

        // Add index of selected option to end of list because of poor design decisions in popup class
        if (action.origin && originNames.indexOf(action.origin)) {
          originNames.push(originNames.indexOf(action.origin) as unknown as string);
        } else {
          originNames.push(0 as unknown as string);
        }

        popup.addPopupRow('dropdown', 'Origin', originNames, undefined, undefined);

        const destNames = [...(storagesStore.all.value ?? [])]
          .sort(storageSort)
          .map(parseStorageName);

        destNames.unshift('Configure on Execution');

        // Add index of selected option to end of list because of poor design decisions in popup class
        if (action.dest && destNames.indexOf(action.dest)) {
          destNames.push(destNames.indexOf(action.dest) as unknown as string);
        } else {
          destNames.push(0 as unknown as string);
        }

        popup.addPopupRow('dropdown', 'Destination', destNames, undefined, undefined);
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
          case 'MTRA':
            action.group = popup.getRowByName('Material Group').rowInput.value;
            action.origin = popup.getRowByName('Origin').rowInput.value;
            action.dest = popup.getRowByName('Destination').rowInput.value;
            break;
        }
        popup.destroy();
        this.generateActionForm();
      } // If no valid name, throw an error
      else {
        nameRow.row.classList.add(...Style.FormError);
      }
    });
  }

  // Create save button at bottom of interface
  private generateSaveForm() {
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

    // Add open button
    const openButton = this.createFormRow(
      this.saveSection,
      'button',
      'command',
      'Execute',
      'openButton',
      'EXECUTE',
    );
    openButton.addEventListener('click', () => {
      showBuffer('XIT ACTION_' + this.actionPackage.global.name.split(' ').join('_'));
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
          for (const option of params) {
            const optionElem = document.createElement('option');
            inputElem.appendChild(optionElem);
            optionElem.value = option;
            optionElem.textContent = option;
          }

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

// Sort storages into an order based on type
function storageSort(a: PrunApi.Store, b: PrunApi.Store) {
  const storagePriorityMap = {
    FTL_FUEL_STORE: 4,
    STL_FUEL_STORE: 3,
    SHIP_STORE: 2,
    STORE: 0,
    WAREHOUSE_STORE: 1,
  };
  return a.type && b.type && storagePriorityMap[a.type] > storagePriorityMap[b.type] ? 1 : -1;
}
