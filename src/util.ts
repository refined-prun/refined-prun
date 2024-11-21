/* eslint-disable @typescript-eslint/no-explicit-any */
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { getStarNaturalId, starsStore } from '@src/infrastructure/prun-api/data/stars';
import { Stations, Selector, Style } from '@src/legacy';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { getMaterialName } from '@src/infrastructure/prun-ui/i18n';
import { sleep } from './utils/sleep';

// Download a file containing fileData with fileName
export function downloadFile(fileData, fileName, isJSON: boolean = true) {
  const blob = new Blob([isJSON ? JSON.stringify(fileData) : fileData], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const urlElement = document.createElement('a');
  urlElement.setAttribute('download', fileName);
  urlElement.href = url;
  urlElement.setAttribute('target', '_blank');
  urlElement.click();
  URL.revokeObjectURL(url);
  return;
}

// Create an option element for a select list
export function createSelectOption(optionLabel, optionValue, rightAlign?) {
  const option = document.createElement('option');
  option.value = optionValue;
  option.textContent = optionLabel;
  if (rightAlign) {
    option.style.direction = 'rtl';
  }
  return option;
}

/**
 * Create a span with the given text
 * @param text
 * @param className
 * @returns {HTMLSpanElement}
 */
export function createTextSpan(text, className: string = 'prun-remove-js') {
  const newSpan = document.createElement('span');
  newSpan.classList.add(className);
  newSpan.textContent = text;
  return newSpan;
}

// Remove all the children of a given element
export function clearChildren(elem) {
  elem.textContent = '';
  while (elem.children[0]) {
    elem.removeChild(elem.children[0]);
  }
  return;
}

// Creates an element that links to a buffer with command "command"
export function createLink(text, command, autoSubmit = true) {
  const link = document.createElement('span');
  link.textContent = text;
  link.addEventListener('click', () => {
    showBuffer(command, {
      autoSubmit,
    });
  });

  const linkDiv = document.createElement('div');
  linkDiv.classList.add('link');
  linkDiv.appendChild(link);
  return linkDiv;
}

// Change the value of a new buffer box
export function changeValue(input: HTMLInputElement, value: string) {
  input.value = value;
  const event = new Event('input', { bubbles: true, cancelable: true });
  input.dispatchEvent(event);
  const changeEvent = new Event('change', { bubbles: true, cancelable: true });
  input.dispatchEvent(changeEvent);
}

// Return all matching buffers
export function getBuffers(bufferCode: string): HTMLElement[] {
  const nodes = document.evaluate(
    `//div[@class='${Selector.BufferHeaderClass}'][starts-with(translate(., 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), '${bufferCode}')]/../..`,
    document,
    null,
    XPathResult.ANY_TYPE,
    null,
  );
  const buffers = [];
  let node;

  while ((node = nodes.iterateNext())) {
    buffers.push(node as never);
  }
  return buffers;
}

// Return all matching buffers from prefound buffer list
export function getBuffersFromList(bufferCode: string, buffers: any[]): any[] {
  return buffers
    .filter(([firstElement]) => firstElement.toLowerCase().startsWith(bufferCode.toLowerCase()))
    .map(([, secondElement]) => secondElement);
}

export function createEmptyTableRow(colspan, text) {
  const line = document.createElement('tr');

  const textColumn = document.createElement('td');
  textColumn.setAttribute('colspan', `${colspan}`);
  textColumn.textContent = text;
  textColumn.style.textAlign = 'center';

  line.appendChild(textColumn);

  return line;
}

// Create a table in the style of PrUN
export function createTable(tile, headers: Array<string>) {
  // Support for section headers in tables?
  /*if (sectionHeaderTitle !== ""){
    const sectionHeader = document.createElement("h3");
    sectionHeader.appendChild(document.createTextNode(sectionHeaderTitle));
    sectionHeader.classList.add(...Style.SidebarSectionHead);
    tile.appendChild(sectionHeader);
  }*/

  const table = document.createElement('table');
  tile.appendChild(table);

  const thead = document.createElement('thead');
  table.appendChild(thead);

  const headerRow = document.createElement('tr');
  thead.appendChild(headerRow);

  for (const title of headers) {
    const header = document.createElement('th');
    header.textContent = title;
    header.style.paddingTop = '0';
    headerRow.appendChild(header);
  }

  const tbody = document.createElement('tbody');
  table.appendChild(tbody);

  return tbody;
}

export function createToolTip(text: string, position: string) {
  const tooltip = document.createElement('span');
  tooltip.innerHTML = `<span data-tooltip="${text}" data-tooltip-position="${position}" class="kfU78EaaOVbQR2YM0eeGew==" style="float: revert;font-size: 12px;margin-top:-4px;">ⓘ</span>`;
  return tooltip.firstChild || tooltip;
}

// Create an empty spacer for the editing interface
export function makePopupSpacer(tile, toRemove) {
  const spacer = document.createElement('div');
  spacer.classList.add(...Style.Spacer);
  spacer.addEventListener('click', () => {
    tile.removeChild(toRemove);
    return;
  });
  return spacer;
}

// Create a warning dialog with a confirmation button before running the callback function with the passed parameters
export function showWarningDialog(
  tile,
  message: string = 'Are you sure?',
  confirmButtonText: string = 'Confirm',
  callbackFunction,
  parameters?,
) {
  const displayTile = tile.parentElement.parentElement.parentElement;

  const overlay = document.createElement('div'); // Main striped overlay
  displayTile.appendChild(overlay);
  overlay.classList.add(...Style.ActionOverlay);

  const centerInterface = document.createElement('div'); // Center yellow block
  overlay.appendChild(centerInterface);
  centerInterface.classList.add(...Style.ActionCenterInterface);

  const confirm = document.createElement('span'); // "Confirmation Required" text
  centerInterface.appendChild(confirm);
  confirm.textContent = 'Confirmation Required';
  confirm.classList.add(...Style.ActionConfirm);

  const confirmMessage = document.createElement('span'); // Message below "Confirmation Required"
  centerInterface.appendChild(confirmMessage);
  confirmMessage.textContent = message;
  confirmMessage.classList.add(...Style.ActionConfirmMessage);

  const buttonDiv = document.createElement('div'); // Div holding both buttons
  centerInterface.appendChild(buttonDiv);
  buttonDiv.classList.add(...Style.ActionButtons);

  const cancelButton = document.createElement('button'); // Cancel Button
  cancelButton.classList.add(...Style.Button);
  cancelButton.classList.add(...Style.ButtonNeutral);
  cancelButton.textContent = 'Cancel';
  buttonDiv.appendChild(cancelButton);

  const confirmButton = document.createElement('button'); // Confirm Button
  confirmButton.classList.add(...Style.Button);
  confirmButton.classList.add(...Style.ButtonDanger);
  confirmButton.textContent = confirmButtonText;
  buttonDiv.appendChild(confirmButton);

  cancelButton.addEventListener('click', () => {
    // Just remove the overlay to cancel
    displayTile.removeChild(overlay);
    return;
  });

  confirmButton.addEventListener('click', () => {
    // Remove the overlay and call the callback function
    displayTile.removeChild(overlay);
    if (parameters) {
      callbackFunction(parameters);
    } else {
      callbackFunction();
    }
    return;
  });
  return;
}

// Create a success dialog with a dismiss button
export function showSuccessDialog(tile, message: string = 'Action succeeded!') {
  const displayTile = tile.parentElement.parentElement.parentElement;

  const overlay = document.createElement('div'); // Main striped overlay
  displayTile.appendChild(overlay);
  overlay.classList.add(...Style.ActionSuccess);

  const centerInterface = document.createElement('span'); // Center green block with message
  overlay.appendChild(centerInterface);
  centerInterface.classList.add(...Style.ActionMessage);
  centerInterface.textContent = message;

  const dismissMessage = document.createElement('span'); // Dismiss message
  centerInterface.appendChild(dismissMessage);
  dismissMessage.textContent = '(click to dismiss)';
  dismissMessage.classList.add(...Style.ActionDismiss);

  overlay.addEventListener('click', () => {
    // Just remove the overlay to dismiss
    displayTile.removeChild(overlay);
    return;
  });

  return;
}

export class Popup {
  private overlapDiv; // The popup element
  public form; // The form element to which all rows are added
  private tile;
  public rows: PopupRow[]; // All the popup rows

  constructor(tile, name, zindex?) {
    this.rows = [] as PopupRow[];
    this.tile = tile;

    this.overlapDiv = document.createElement('div');
    this.overlapDiv.classList.add(...Style.OverlappingDiv);
    const greyStripes = document.createElement('div');
    greyStripes.classList.add(...Style.GreyStripes);
    this.overlapDiv.appendChild(greyStripes);
    if (zindex) {
      this.overlapDiv.style.zIndex = zindex;
    }
    tile.insertBefore(this.overlapDiv, tile.firstChild);

    greyStripes.appendChild(makePopupSpacer(tile, this.overlapDiv));

    const popupInterfaceWrapper = document.createElement('div');
    popupInterfaceWrapper.classList.add(...Style.CenterInterface);
    greyStripes.appendChild(popupInterfaceWrapper);
    const popupInterface = document.createElement('div');
    popupInterface.classList.add('DraftConditionEditor__form___fF72bJM');
    popupInterfaceWrapper.appendChild(popupInterface);

    const header = document.createElement('h3');
    header.appendChild(document.createTextNode(name));
    header.classList.add(...Style.SidebarSectionHead);
    popupInterface.appendChild(header);
    header.style.margin = '0.5em 0 0.5em';

    this.form = document.createElement('div');
    popupInterface.appendChild(this.form);

    greyStripes.appendChild(makePopupSpacer(tile, this.overlapDiv));
  }

  addPopupRow(rowType, label, inputText, tooltip, callback, params?) {
    const newRow = new PopupRow(rowType, label, inputText, tooltip, callback, params);
    this.rows.push(newRow);
    this.form.appendChild(newRow.row);
    return newRow;
  }

  removePopupRow(rowIndex) {
    const toDelete = this.rows.splice(rowIndex, 1)[0];
    this.form.removeChild(toDelete.row);
  }

  getRowByName(name) {
    let selectedRow;

    this.rows.forEach(row => {
      if (row.rowLabel == name) {
        selectedRow = row;
        return;
      }
    });

    return selectedRow;
  }

  destroy() {
    this.tile.removeChild(this.overlapDiv);
  }

  moveRowToBottom(rowIndex) {
    const movingRow = this.rows[rowIndex];
    this.removePopupRow(rowIndex);
    this.rows.push(movingRow);
    this.form.appendChild(movingRow.row);
  }
}

class PopupRow {
  public rowType;
  public rowLabel;
  public row;
  public rowInput;

  // rowType: Either "text" or "button" or "dropdown" or "checkbox"
  // label: Label of the row
  // inputText: If "text" type, the text in the input field. If "button" type, text on the button. If "dropdown" type an array of values with the last one being the index of the currently selected value. If "checkbox" boolean value of checkbox
  // tooltip: Text to appear on the tooltip, undefined or null for no tool tip
  // rowInputCallback: Function called when input is clicked/changed
  // params: Callback Function parameters
  constructor(rowType, label, inputText, tooltip, callback, params?) {
    this.rowType = rowType;
    this.rowLabel = label;

    if (rowType == 'text' || rowType == 'date' || rowType == 'number' || rowType == 'checkbox') {
      this.row = document.createElement('div');
      this.row.classList.add(...Style.FormRow);
      const rowLabel = document.createElement('label');
      rowLabel.textContent = label;
      if (tooltip) {
        rowLabel.appendChild(createToolTip(tooltip, 'right'));
      }
      rowLabel.classList.add(...Style.FormLabel);
      this.row.appendChild(rowLabel);
      const inputInputDiv = document.createElement('div');
      inputInputDiv.classList.add(...Style.FormInput);
      this.row.appendChild(inputInputDiv);
      this.rowInput = document.createElement('input');
      this.rowInput.style.textAlign = 'left';

      inputInputDiv.appendChild(this.rowInput);

      if (inputText) {
        this.rowInput.value = inputText;
      }

      if (rowType == 'date') {
        this.rowInput.type = 'datetime-local';
      } else if (rowType == 'number') {
        this.rowInput.type = 'number';
      } else if (rowType == 'checkbox') {
        this.rowInput.type = 'checkbox';
        this.rowInput.checked = inputText;
      }

      if (rowType != 'checkbox') {
        this.rowInput.style.width = '80%';
      }

      if (callback) {
        const rowInput = this.rowInput;
        this.rowInput.addEventListener('input', () => {
          callback(rowInput.value, params);
        });
      }
    } else if (rowType == 'dropdown') {
      this.row = document.createElement('div');
      this.row.classList.add(...Style.FormRow);
      const rowLabel = document.createElement('label');
      rowLabel.textContent = label;
      if (tooltip) {
        rowLabel.appendChild(createToolTip(tooltip, 'right'));
      }
      rowLabel.classList.add(...Style.FormLabel);
      this.row.appendChild(rowLabel);
      const inputDiv = document.createElement('div');
      inputDiv.classList.add(...Style.FormInput);
      this.row.appendChild(inputDiv);
      this.rowInput = document.createElement('select');
      this.rowInput.classList.add('select');
      this.rowInput.style.width = '80%';
      this.rowInput.style.textAlignLast = 'left';

      this.rowInput.name = `popup-dropdown${Math.floor(Math.random() * 10000).toString()}`;
      this.rowInput.id = `popup-dropdown${Math.floor(Math.random() * 10000).toString()}`;

      const selectedIndex = inputText[inputText.length - 1];
      inputText = inputText.slice(0, -1);

      inputText.forEach(text => {
        this.rowInput.appendChild(createSelectOption(text, text));
      });

      if (this.rowInput.children[selectedIndex]) {
        (this.rowInput.children[selectedIndex] as HTMLOptionElement).selected = true;
        this.rowInput.selectedIndex = selectedIndex;
      }

      inputDiv.appendChild(this.rowInput);

      if (callback) {
        const rowInput = this.rowInput;
        this.rowInput.addEventListener('change', () => {
          callback(rowInput.selectedOptions[0].value, params);
        });
      }
    } else if (rowType == 'button') {
      this.row = document.createElement('div');
      this.row.classList.add(...Style.FormSaveRow);

      const rowLabel = document.createElement('label');
      rowLabel.textContent = label;
      rowLabel.classList.add(...Style.FormSaveLabel);
      this.row.appendChild(rowLabel);
      const inputDiv = document.createElement('div');
      inputDiv.classList.add(...Style.FormSaveInput);
      this.row.appendChild(inputDiv);
      this.rowInput = document.createElement('button');
      this.rowInput.textContent = inputText;
      this.rowInput.classList.add(...Style.Button);
      this.rowInput.classList.add(...Style.ButtonPrimary);
      inputDiv.appendChild(this.rowInput);

      if (callback) {
        this.rowInput.addEventListener('click', () => {
          callback(params);
        });
      }
    }
  }
}

export async function loadLocalFile(path: string) {
  return await fetch(chrome.runtime.getURL(path));
}

export async function loadLocalJson(path: string) {
  const file = await loadLocalFile(`json/${path}`);
  return await file.json();
}

// A function to compare two planets (to be used in .sort() functions)
export function comparePlanets(idOrNameA: string, idOrNameB: string) {
  const planetA = planetsStore.find(idOrNameA);
  const planetB = planetsStore.find(idOrNameB);
  if (planetA === planetB) {
    return 0;
  }
  if (!planetA) {
    return 1;
  }
  if (!planetB) {
    return -1;
  }

  const systemA = starsStore.getByPlanetNaturalId(planetA.naturalId);
  const systemB = starsStore.getByPlanetNaturalId(planetB.naturalId);
  if (!systemA) {
    return 1;
  }
  if (!systemB) {
    return -1;
  }

  if (systemA !== systemB) {
    const naturalIdA = getStarNaturalId(systemA);
    const naturalIdB = getStarNaturalId(systemB);
    const isSystemANamed = systemA.name !== naturalIdA;
    const isSystemBNamed = systemB.name !== naturalIdB;

    if (isSystemANamed && !isSystemBNamed) {
      return -1;
    }
    if (isSystemBNamed && !isSystemANamed) {
      return 1;
    }
    if (isSystemANamed && isSystemBNamed) {
      return systemA.name > systemB.name ? 1 : -1;
    }
    return naturalIdA > naturalIdB ? 1 : -1;
  }

  const isPlanetANamed = planetA.name !== planetA.naturalId;
  const isPlanetBNamed = planetB.name !== planetB.naturalId;

  if (isPlanetANamed && !isPlanetBNamed) {
    return -1;
  }
  if (isPlanetANamed && !isPlanetBNamed) {
    return 1;
  }

  return isPlanetANamed && isPlanetBNamed
    ? planetA.name > planetB.name
      ? 1
      : -1
    : planetA.naturalId > planetB.naturalId
      ? 1
      : -1;
}

export function extractPlanetName(text: string | null) {
  if (!text) {
    return text;
  }
  text = text
    // Clear parenthesis
    .replace(/\s*\([^)]*\)/, '')
    // Clear space between system and planet
    .replace(/(\d)\s+(?=[a-zA-Z])/, '$1')
    // Clear system name in named systems
    .replace(/.*\s-\s/, '');
  return (Stations[text] ?? text) as string;
}

export function changeSelectValue(input, selectIndex) {
  input.selectedIndex = selectIndex;
  const changeEvent = new Event('change', { bubbles: true, cancelable: true });
  input.dispatchEvent(changeEvent);
}

export function getMaterialNameByTicker(ticker?: string | null) {
  const material = materialsStore.getByTicker(ticker);
  return getMaterialName(material);
}

export async function clickElement(element?: HTMLElement | null) {
  if (!element) {
    return;
  }

  element.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );

  element.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );

  await sleep(0);

  element.dispatchEvent(
    new PointerEvent('pointerup', {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );

  element.dispatchEvent(
    new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );

  element.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );
}
