/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  clearChildren,
  getLocalStorage,
  setSettings,
  createTextSpan,
  createTable,
  createLink,
  Popup,
  showWarningDialog,
} from '@src/util';
import { Style, TextColors } from '@src/Style';
import xit from './xit-registry';
import { getBuildingLastRepair, sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { calculatePlanetBurn } from '@src/core/burn';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { ddmmyyyy } from '@src/utils/format';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

class Checklists {
  private tile: HTMLElement;
  private parameters: string[];
  public name = 'CHECKLIST';

  constructor(tile, parameters) {
    this.tile = tile;
    this.parameters = parameters;
  }

  create_buffer() {
    clearChildren(this.tile);

    if (this.parameters.length == 1) {
      // Display table of checks and links to open each or delete each
      getLocalStorage('PMMG-Checklists', generateCheckTable, this.tile);
    } else {
      // Display the specified check
      const checkName = this.parameters.slice(1).join(' ');
      displayChecklist(this.tile, checkName);
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

// Might need to rewrite
function generateCheckTable(result, tile) {
  // Create a list of all checklists
  if (!tile) {
    return;
  }

  if (!result['PMMG-Checklists']) {
    result['PMMG-Checklists'] = {};
  }

  const tbody = createTable(tile, ['Name', 'Incomplete', 'Due Date', 'Modify']);

  if (Object.keys(result['PMMG-Checklists']).length == 0) {
    // Make an empty line in the table if no checklists are present
    const line = document.createElement('tr');
    const textColumn = document.createElement('td');
    textColumn.colSpan = 4;
    textColumn.textContent = 'No Checklists';
    line.appendChild(textColumn);
    tbody.appendChild(line);
  }

  // Sort the checklists so they are in duedate order
  const checklistList = Object.entries(result['PMMG-Checklists']);
  checklistList.sort(checklistDuedateSort);

  // For each checklist, draw the line in the table
  checklistList.forEach(obj => {
    // Should sort by duedate at some point...
    const listName = obj[0];
    const checklist = obj[1] as any;

    const row = document.createElement('tr');
    tbody.appendChild(row);

    // Make a name element that links to the checklist
    const nameElem = document.createElement('td');
    nameElem.appendChild(createLink(listName, `XIT CHECKLIST_${listName.replace(/ /, '_')}`));
    row.appendChild(nameElem);

    // Count incomplete and find most recent duedate
    let incomplete = 0;
    let duedate;

    checklist.forEach(condition => {
      if (!condition.completed) {
        incomplete++;
        if (condition.duedate && (!duedate || condition.duedate < duedate)) {
          // If this is an earlier duedate than recorded, record it
          duedate = condition.duedate;
        }
      }
    });

    // Add the incomplete and duedate columns
    const incompleteElem = document.createElement('td');
    incompleteElem.appendChild(
      createTextSpan(incomplete.toLocaleString(undefined, { maximumFractionDigits: 0 })),
    );
    row.appendChild(incompleteElem);

    const duedateElem = document.createElement('td');
    duedateElem.appendChild(createTextSpan(duedate ? ddmmyyyy(duedate) : '--')); // -- or -? Best way to signify no value?
    if (duedate && duedate < Date.now()) {
      duedateElem.style.color = TextColors.Failure;
    }
    row.appendChild(duedateElem);

    // Create modify column
    const modifyElem = document.createElement('td');
    row.appendChild(modifyElem);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add(...Style.Button);
    deleteButton.classList.add(...Style.ButtonDanger);
    modifyElem.appendChild(deleteButton);
    deleteButton.textContent = 'delete';

    deleteButton.addEventListener('click', () => {
      showWarningDialog(tile, 'Are you sure you want to delete this checklist?', 'Confirm', () => {
        getLocalStorage('PMMG-Checklists', deleteChecklist, [listName, tile]);
      });
    });
  });

  tile.style.minHeight = 'auto';

  const newButton = document.createElement('button');
  newButton.classList.add(...Style.Button);
  newButton.classList.add(...Style.ButtonPrimary);
  newButton.style.margin = '5px';

  newButton.textContent = 'NEW CHECKLIST';
  newButton.addEventListener('click', () => {
    const popup = new Popup(tile, 'New Checklist');
    popup.addPopupRow(
      'text',
      'Checklist Name',
      '',
      'The name of the checklist. The command to access will be XIT CHECK_{name}',
      () => {},
    );
    popup.addPopupRow('button', 'CMD', 'Create', undefined, () => {
      const nameRow = popup.getRowByName('Checklist Name');
      if (!nameRow || !nameRow.rowInput) {
        return;
      }
      showBuffer(`XIT CHECK_${nameRow.rowInput.value || ''}`);
      popup.destroy();
    });
  });
  tile.appendChild(newButton);

  return;
}

function checklistDuedateSort(a, b) {
  const aDuedate = calculateDuedate(a[1]);
  const bDuedate = calculateDuedate(b[1]);

  if (aDuedate && bDuedate) {
    return aDuedate > bDuedate ? 1 : -1;
  } else if (aDuedate && !bDuedate) {
    return -1;
  }
  return 1;
}

function calculateDuedate(checklist) {
  let duedate;

  checklist.forEach(condition => {
    if (!condition.completed) {
      if (condition.duedate && (!duedate || condition.duedate < duedate)) {
        // If this is an earlier duedate than recorded, record it
        duedate = condition.duedate;
      }
    }
  });

  return duedate;
}

function deleteChecklist(result, params) {
  if (!params[0] || !params[1]) {
    return;
  }
  const checklistName = params[0];
  const tile = params[1];

  if (!result['PMMG-Checklists'][checklistName]) {
    return;
  }

  delete result['PMMG-Checklists'][checklistName];

  setSettings(result);
  clearChildren(tile);
  generateCheckTable(result, tile);
}

function displayChecklist(tile, checkName) {
  // Create an individual checklist
  // Create the title at the top of the checklist
  const nameDiv = document.createElement('div');
  nameDiv.appendChild(createTextSpan(checkName));
  nameDiv.classList.add('title');
  tile.appendChild(nameDiv);

  const checkDiv = document.createElement('div'); // Div where all the checklist items are housed
  tile.appendChild(checkDiv);

  const checklist = new Checklist(checkName, checkDiv, tile);

  const addButton = document.createElement('button');
  addButton.classList.add(...Style.Button);
  addButton.classList.add(...Style.ButtonPrimary);
  tile.appendChild(addButton);
  addButton.style.margin = '5px';
  addButton.textContent = 'ADD ITEM';

  addButton.addEventListener('click', () => {
    generateEditPopup(tile, checklist);
  });

  return;
}

// Generate the popup to add or edit a checklist
function generateEditPopup(tile, checklist, info?) {
  if (!info) {
    info = {
      type: 'Text',
      completed: false,
      id: generateRandomHexSequence(8),
      created: Date.now(),
    }; // The information defining the checklist item
  }
  const popup = new Popup(tile, 'Checklist Item Editor');

  // Type row (present on all)
  popup.addPopupRow(
    'dropdown',
    'Type',
    ['Text', 'Resupply', 'Repair', editPopupTypes[info.type]],
    'The type of checklist item being added.',
    updatePopupInfo,
    [popup, info],
  );

  // Date row (present on all)
  let date;
  if (info.duedate) {
    date = new Date(info.duedate);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  }
  popup.addPopupRow(
    'date',
    'Due Date',
    info.duedate ? date.toISOString().slice(0, 16) : undefined,
    undefined,
    updatePopupInfo,
    [popup, info],
  );

  // Recurring period row (present on all)
  popup.addPopupRow(
    'number',
    'Recurring Period',
    info.recurring,
    'How often the checklist item will be added back. Will not function without a due date.',
    updatePopupInfo,
    [popup, info],
  );

  // Confirm/add row (present on all)
  popup.addPopupRow('button', 'CMD', 'SAVE', 'Save and add the checklist item.', addChecklistItem, [
    popup,
    info,
    checklist,
  ]);

  // Delete row (present on all)
  popup.addPopupRow(
    'button',
    'DELETE',
    'DELETE',
    'Delete the current checklist item.',
    deleteChecklistItem,
    [popup, info, checklist],
  );
  popup.getRowByName('DELETE').rowInput.classList.remove(Style.ButtonPrimary);
  popup.getRowByName('DELETE').rowInput.classList.add(Style.ButtonDanger);

  updatePopupInfo(null, [popup, info, true]); // Trigger the creation of additional rows
}

const editPopupTypes = {
  Text: 0,
  Resupply: 1,
  Repair: 2,
  //	"Construct": 3,
  //	"Transport": 4
};

// This function is called every time something changes on the popup.
function updatePopupInfo(junk, params) {
  let planetNames;
  if (!params[0] || !params[1]) {
    return;
  }

  const popup = params[0];
  const info = params[1];
  const manuallyUpdate = params[2];

  const typeValue = popup.rows[0].rowInput.selectedOptions[0].value;
  // Type value changed
  if (info.type != typeValue || manuallyUpdate) {
    // Delete all rows (except universal ones at the top)
    const numRows = popup.rows.length;
    for (let i = 3; i < numRows - 2; i++) {
      popup.removePopupRow(3);
    }

    // Update all of the rows to represent the correct info
    if (typeValue == 'Text') {
      // If it was just changed back to text...
      // Add in the text row
      popup.addPopupRow('text', 'Text', info['name'], undefined, updatePopupInfo, [popup, info]);
    } else if (typeValue == 'Resupply') {
      // If it was changed to Resupply
      // Add in the planet row
      planetNames = [] as any[];

      planetNames = workforcesStore.all.value.map(x => getEntityNameFromAddress(x.address)!);

      if (info['planet'] && planetNames.includes(info['planet']) && planetNames.length !== 1) {
        planetNames.push(planetNames.indexOf(info['planet']));
      }

      popup.addPopupRow(
        'dropdown',
        'Planet',
        planetNames,
        'The base to resupply.',
        updatePopupInfo,
        [popup, info],
      );
      popup.addPopupRow(
        'number',
        'Days',
        info['days'] ? info['days'].toString() : '0',
        'The number of days of supplies',
        updatePopupInfo,
        [popup, info],
      );
    } else if (typeValue == 'Repair') {
      planetNames = [] as any[];

      planetNames = sitesStore.all.value.map(site => getEntityNameFromAddress(site.address)!);
      if (info['planet'] && planetNames.includes(info['planet']) && planetNames.length !== 1) {
        planetNames.push(planetNames.indexOf(info['planet']));
      }

      popup.addPopupRow('dropdown', 'Planet', planetNames, 'The base to repair.', updatePopupInfo, [
        popup,
        info,
      ]);
      popup.addPopupRow(
        'number',
        'Threshold',
        info['days'] ? info['days'].toString() : '0',
        'The cutoff for the age of buildings displayed (in days)',
        updatePopupInfo,
        [popup, info],
      );
    }

    // Move the 'save' and 'delete' rows to the bottom of the popup
    popup.moveRowToBottom(3);
    popup.moveRowToBottom(3);
  }

  // Update the values in info
  switch (typeValue) {
    case 'Text': {
      const textRow = popup.getRowByName('Text');
      if (textRow) {
        info['name'] = textRow.rowInput.value;
      }
      break;
    }
    case 'Resupply': {
      const planetRow = popup.getRowByName('Planet');
      const daysRow = popup.getRowByName('Days');
      if (planetRow) {
        info['planet'] = planetRow.rowInput.selectedOptions[0].value;
      }
      if (daysRow) {
        info['days'] = daysRow.rowInput.value;
      }
      break;
    }
    case 'Repair': {
      const planetRow = popup.getRowByName('Planet');
      const daysRow = popup.getRowByName('Threshold');
      if (planetRow) {
        info['planet'] = planetRow.rowInput.selectedOptions[0].value;
      }
      if (daysRow) {
        info['days'] = daysRow.rowInput.value;
      }
      break;
    }
  }

  info['type'] = typeValue;
  info['duedate'] =
    popup.rows[1].rowInput.value == ''
      ? undefined
      : new Date(popup.rows[1].rowInput.value).getTime();
  info['recurring'] = popup.rows[2].rowInput.value == '' ? undefined : popup.rows[2].rowInput.value;
  return junk;
}

function deleteChecklistItem(params) {
  if (!params[0] || !params[1] || !params[2]) {
    return;
  }

  const popup = params[0];
  const info = params[1];
  const checklist = params[2];

  popup.destroy();
  getLocalStorage('PMMG-Checklists', updateStoredChecklists, [info, checklist, true, false]);

  return;
}

// Add (or update) a checklist item
function addChecklistItem(params) {
  if (!params[0] || !params[1] || !params[2] || !params[3]) {
    return;
  }

  const popup = params[0];
  const info = params[1];
  const checklist = params[2];

  // Do some post-processing of the info
  switch (info.type) {
    case 'Resupply': {
      info.name = `Supply [[p:${info['planet']}]] with ${info['days']} ${
        info['days'] == '1' ? 'day' : 'days'
      } of consumables.`;

      const site = sitesStore.getByPlanetName(info['planet']);
      const planetWorkforce = workforcesStore.getById(site?.siteId)?.workforces;
      const planetProduction = productionStore.getBySiteId(site?.siteId);

      const burn = calculatePlanetBurn(planetProduction, planetWorkforce, undefined);

      info['children'] = []; // This also resets previous children, I think this is fine/good?
      Object.keys(burn).forEach(mat => {
        if (burn[mat]['DailyAmount'] < 0) {
          const amt = -burn[mat]['DailyAmount'] * parseFloat(info.days);
          const child = {} as any;
          child.id = generateRandomHexSequence(8);
          child.isChild = true;

          child.name = `${amt.toLocaleString(undefined, { maximumFractionDigits: 0 })} [[m:${mat}]]`;
          info['children'].push(child);
        }
      });
      break;
    }
    case 'Repair': {
      info.name = `Repair buildings on [[p:${info['planet']}]] older than ${
        info['days']
      }${info['days'] == '1' ? ' day' : ' days'}`;

      const mats = {};

      const site = sitesStore.getByPlanetName(info['planet']);
      info['children'] = []; // This also resets previous children
      if (site?.platforms) {
        site.platforms.forEach(building => {
          if (
            building.repairMaterials.length !== 0 &&
            Date.now() - getBuildingLastRepair(building) > parseFloat(info.days) * 86400000
          ) {
            // Old enough
            building.repairMaterials.forEach(mat => {
              if (mats[mat.material.ticker]) {
                mats[mat.material.ticker] += mat.amount;
              } else {
                mats[mat.material.ticker] = mat.amount;
              }
            });
          }
        });
      }

      Object.keys(mats).forEach(mat => {
        const child = {} as any;
        child.id = generateRandomHexSequence(8);
        child.isChild = true;

        child.name = `${mats[mat].toLocaleString(undefined, { maximumFractionDigits: 0 })} [[m:${mat}]]`;
        info['children'].push(child);
      });
      break;
    }
  }

  popup.destroy();

  getLocalStorage('PMMG-Checklists', updateStoredChecklists, [info, checklist]);

  return;
}

const generateRandomHexSequence = length =>
  Array.from({ length }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');

// Add or update the "toUpdate" checklist to the list of checklists.
function updateStoredChecklists(result, params) {
  if (!params[0] || !params[1]) {
    return;
  }
  const toUpdate = params[0];
  const checklist = params[1] as Checklist;
  const toDelete = params[2];
  const isChild = params[3];

  if (!result['PMMG-Checklists']) {
    result['PMMG-Checklists'] = {};
  }

  if (!result['PMMG-Checklists'][checklist.name]) {
    result['PMMG-Checklists'][checklist.name] = [];
  }

  if (isChild) {
    // If a child, look at the children of each element
    const outerIndex = result['PMMG-Checklists'][checklist.name].findIndex(
      obj => obj.children && obj.children.findIndex(child => child.id == toUpdate.id) != -1,
    );

    if (outerIndex == -1) {
      console.log('Bad Indexing in Checklist Children');
      return;
    }
    const innerIndex = result['PMMG-Checklists'][checklist.name][outerIndex].children.findIndex(
      child => child.id == toUpdate.id,
    );

    if (innerIndex == -1 && !toDelete) {
      result['PMMG-Checklists'][checklist.name][outerIndex].children.push(toUpdate);
    } else if (innerIndex != -1) {
      if (toDelete) {
        result['PMMG-Checklists'][checklist.name][outerIndex].children.splice(innerIndex, 1);
      } else {
        result['PMMG-Checklists'][checklist.name][outerIndex].children[innerIndex] = toUpdate;
      }
    }
  } // If not a child, just look at the top level
  else {
    const index = result['PMMG-Checklists'][checklist.name].findIndex(obj => obj.id == toUpdate.id);

    if (index == -1 && !toDelete) {
      // New item
      result['PMMG-Checklists'][checklist.name].push(toUpdate);
    } else if (index != -1) {
      // Old item
      if (toDelete) {
        result['PMMG-Checklists'][checklist.name].splice(index, 1); // Remove from list
      } else {
        result['PMMG-Checklists'][checklist.name][index] = toUpdate;
      }
    }
  }

  setSettings(result);
  checklist.recreateCallback(result, checklist); // Do I want to call a recreate here? Or just when things are deleted? Depends on behavior
}

// Create the name text (with hyperlinks)
function createName(name) {
  name = name || '';

  const matches = [...name.matchAll(/\[\[([a-zA-Z]):([^:\]]+)\]\]/g)];

  const nameElem = document.createElement('span');
  let nameCopy = name;
  let cut = 0;
  matches.forEach(match => {
    nameElem.appendChild(createTextSpan(nameCopy.substring(0, match.index - cut)));
    let command;
    switch (match[1]) {
      case 'm':
        command = `MAT ${match[2]}`;
        break;
      case 'p':
        command = `PLI ${match[2]}`;
        break;
      default:
        nameElem.appendChild(createTextSpan(match[0]));
    }

    if (command) {
      const linkElem = createLink(match[2], command);
      linkElem.style.display = 'inline';
      nameElem.appendChild(linkElem);
    }

    nameCopy = nameCopy.slice(match.index + match[0].length - cut);
    cut = match.index + match[0].length;
  });
  nameElem.appendChild(createTextSpan(nameCopy));

  return nameElem;
}

class Checklist {
  // An individual checklist
  public name: string; // The name of the checklist
  public checkDiv: HTMLElement; // The div all the elements are contained in
  public tile: HTMLElement; // The tile of the whole buffer. ONLY USE FOR POPUP GENERATION

  constructor(name, checkDiv, tile) {
    this.name = name;
    this.checkDiv = checkDiv;
    this.tile = tile;

    this.recreate();
  }

  recreate() {
    // Toggles the checklist to refresh with the latest info from local storage. Shouldn't shift around the user's position on the checklist. Also serves as a way to generate the checklist for the first time
    getLocalStorage('PMMG-Checklists', this.recreateCallback, this);
  }

  recreateCallback(result, thisObject) {
    if (!result['PMMG-Checklists']) {
      return;
    }

    // Keep the same height to avoid jumping as the buffer is updated
    const prevHeight = thisObject.checkDiv.getBoundingClientRect().height;
    thisObject.checkDiv.style.minHeight = `${prevHeight.toString()}px`;
    clearChildren(thisObject.checkDiv);

    const checklistItems = [] as CheckItem[];

    // Recreate all the check items from the result information
    if (result['PMMG-Checklists'][thisObject.name]) {
      result['PMMG-Checklists'][thisObject.name].forEach(checkInfo => {
        checklistItems.push(new CheckItem(checkInfo, thisObject));
      });
    }

    checklistItems.sort(checkSort);
    checklistItems.forEach(item => {
      thisObject.checkDiv.appendChild(item.item);

      if (item.children.length > 0) {
        item.children.forEach(child => {
          thisObject.checkDiv.appendChild(child.item);
        });
      }
    });

    // Restore height to auto to avoid blank space at the end
    thisObject.checkDiv.style.minHeight = 'auto';
  }
}

class CheckItem {
  // Individual checklist item. Held within a checklist.
  public item: HTMLElement; // The actual HTML element on the DOM
  public checkCircle: HTMLElement; // The circle indicating the completion of the item
  public checkText: HTMLElement; // The element containing the name of the check item
  public dateElem?: HTMLElement; // The element containing the due date of the check item
  public checkInfo; // The information on the checklist item (what's stored in localStorage)
  public checklist; // The parent checklist holding this item
  public editButton?: HTMLButtonElement; // The button to edit the current checklist item
  public isChild: boolean; // Whether the element is a child of another
  public children: CheckItem[]; // The children of this check element. So each of them is sorted together.

  constructor(checkInfo, checklist, isChild?) {
    this.children = [];
    this.isChild = isChild;
    this.checkInfo = checkInfo;
    this.checklist = checklist;

    this.item = document.createElement('div'); // Overall element
    this.item.classList.add('check-item');
    this.item.style.marginTop = '5px';
    this.item.style.display = 'flex';
    this.item.style.alignItems = 'center';

    this.checkCircle = document.createElement('div'); // Just the check circle
    this.item.appendChild(this.checkCircle);

    this.checkCircle.innerHTML = checkInfo.completed ? filledCircle : unfilledCircle;
    this.checkCircle.style.marginRight = '5px';
    this.checkCircle.style.marginLeft = '5px';
    this.checkCircle.style.cursor = 'pointer';

    if (isChild) {
      this.checkCircle.style.marginLeft = '20px';
    }

    const mainTextDiv = document.createElement('div'); // The right side with all the text
    mainTextDiv.style.display = 'flex'; // These two styles are to stack vertically
    mainTextDiv.style.flexDirection = 'column';
    mainTextDiv.style.flex = '1'; // This is to space left/right correctly

    this.checkText = createName(checkInfo.name); // The checklist name
    mainTextDiv.appendChild(this.checkText);

    if (checkInfo.duedate) {
      // The due date under the name
      let dateText = ddmmyyyy(checkInfo.duedate);
      if (checkInfo.recurring) {
        dateText += ` (every ${checkInfo.recurring.toLocaleString(undefined, { maximumFractionDigits: 1 })} day${
          checkInfo.recurring == 1 ? ')' : 's)'
        }`;
      }
      this.dateElem = createTextSpan(dateText);
      this.dateElem.style.color =
        checkInfo.duedate < Date.now() && !checkInfo.completed ? TextColors.Failure : '#787878';
      mainTextDiv.appendChild(this.dateElem);
    } else {
      this.checkText.style.marginTop = '-1px'; // Slightly change position for non-due date checklist items
    }

    this.item.appendChild(mainTextDiv);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const thisObject = this;

    if (!this.isChild) {
      // Children can't be edited
      // Make the edit button
      this.editButton = document.createElement('button');
      this.editButton.textContent = 'modify';
      this.editButton.classList.add(...Style.SmallButton);
      this.editButton.style.marginRight = '5px';
      this.item.appendChild(this.editButton);

      // Handle action listener for modify button
      this.editButton.addEventListener('click', () => {
        generateEditPopup(checklist.tile, checklist, thisObject.checkInfo);
      });
    }

    // Handle the action listener for the checklist item
    this.checkCircle.addEventListener('click', () => {
      thisObject.changeCheckedState();
    });

    // Handle children
    if (checkInfo.children) {
      checkInfo.children.forEach(child => {
        if (child.invisible) {
          return;
        }
        this.children.push(new CheckItem(child, checklist, true));
      });
    }
  }

  changeCheckedState() {
    // Update the display of the current check item (false to true or true to false)
    this.checkInfo.completed = !this.checkInfo.completed;
    this.checkCircle.innerHTML = this.checkInfo.completed ? filledCircle : unfilledCircle;

    getLocalStorage('PMMG-Checklists', updateStoredChecklists, [
      this.checkInfo,
      this.checklist,
      false,
      this.isChild,
    ]);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const thisObject = this;

    setTimeout(() => {
      // Wait a few seconds before deleting
      getLocalStorage('PMMG-Checklists', result => {
        // First, check whether the object is still completed (in local storage)
        if (!result['PMMG-Checklists'] || !result['PMMG-Checklists'][thisObject.checklist.name]) {
          return;
        }
        let completed;

        if (thisObject.checkInfo.isChild) {
          const parentIndex = result['PMMG-Checklists'][thisObject.checklist.name].findIndex(
            obj =>
              obj.children &&
              obj.children.findIndex(obj2 => obj2.id == thisObject.checkInfo.id) != -1,
          );
          const childIndex =
            parentIndex == -1
              ? -1
              : result['PMMG-Checklists'][thisObject.checklist.name][
                  parentIndex
                ].children.findIndex(obj => obj.id == thisObject.checkInfo.id);
          completed =
            childIndex != -1 &&
            result['PMMG-Checklists'][thisObject.checklist.name][parentIndex].children[childIndex]
              .completed;
        } else {
          const index = result['PMMG-Checklists'][thisObject.checklist.name].findIndex(
            obj => obj.id == thisObject.checkInfo.id,
          );
          completed =
            index != -1 && result['PMMG-Checklists'][thisObject.checklist.name][index].completed;
        }

        if (completed) {
          let toDelete = true;
          // Recur or delete object
          if (thisObject.checkInfo.isChild) {
            thisObject.checkInfo.invisible = true;
            toDelete = false;
          } else if (thisObject.checkInfo.recurring && thisObject.checkInfo.duedate) {
            // Recur
            thisObject.checkInfo.duedate += thisObject.checkInfo.recurring * 86400000;
            thisObject.checkInfo.completed = false;
            toDelete = false;
            if (thisObject.checkInfo.children) {
              thisObject.checkInfo.children.forEach(child => {
                child.invisible = false;
                child.completed = false;
              });
            }
          }
          // Make the update
          getLocalStorage('PMMG-Checklists', updateStoredChecklists, [
            thisObject.checkInfo,
            thisObject.checklist,
            toDelete,
            thisObject.isChild,
          ]); // Delete or recur the object
        }
      });
    }, 2500);
  }
}

const unfilledCircle = `<svg width="15" height="15" viewBox = "10 10 80 80">
  <path d="M 50 10 A 40 40 0 1 0 50 90 A 40 40 0 1 0 50 10 Z M 50 20 A 30 30 0 1 1 50 80 A 30 30 0 1 1 50 20 Z" fill="#f7a600" stroke="none" stroke-width="0" />
</svg>`;

const filledCircle = `<svg width="15" height="15" viewBox = "10 10 80 80">
  <path d="M 50 10 A 40 40 0 1 0 50 90 A 40 40 0 1 0 50 10 Z M 50 20 A 30 30 0 1 1 50 80 A 30 30 0 1 1 50 20 Z" fill="#f7a600" stroke="none" stroke-width="0" /><circle cx="50" cy="50" r="20" fill="#f7a600" stroke="none" stroke-width="2" />
</svg>`;

function checkSort(a, b) {
  // May have to swap -1 for 1 if sorting the wrong way.
  if (a.checkInfo.duedate && b.checkInfo.duedate) {
    // Both have duedate
    return a.checkInfo.duedate > b.checkInfo.duedate ? 1 : -1;
  } else if (a.checkInfo.duedate && !b.checkInfo.duedate) {
    // a has duedate
    return -1;
  } else if (!a.checkInfo.duedate && b.checkInfo.duedate) {
    // b has duedate
    return 1;
  } // Neither has duedate

  return a.checkInfo.created > b.checkInfo.created ? 1 : -1;
}

xit.add({
  command: ['CHECK', 'CHECKLIST', 'CHECKLISTS'],
  name: 'CHECKLIST',
  module: Checklists,
});
