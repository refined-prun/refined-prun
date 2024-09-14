/* eslint-disable @typescript-eslint/no-explicit-any */
import { Selector } from './Selector';
import { CategoryColors, Style, WithStyles } from './Style';
import system from '@src/system';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { getMaterialNameByTicker } from '@src/infrastructure/prun-ui/material-names';
import { materialCategoriesStore } from '@src/infrastructure/prun-api/data/material-categories';
import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { getStarNaturalId, starsStore } from '@src/infrastructure/prun-api/data/stars';
import { Stations } from '@src/GameProperties';
import { hhmm } from '@src/utils/format';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

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

export function convertDurationToETA(parsedSeconds) {
  const eta = new Date();
  const now = new Date();
  eta.setSeconds(eta.getSeconds() + parsedSeconds);
  const diffTime = Math.abs(eta.getTime() - now.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let ret = hhmm(eta);
  if (diffDays > 0) {
    ret += ` +${diffDays}d`;
  }
  return ret;
}

/**
 * Parse duration into seconds
 * @param duration string
 */
export function parseDuration(duration) {
  const days = duration.match(/(\d+)\s*d/);
  const hours = duration.match(/(\d+)\s*h/);
  const minutes = duration.match(/(\d+)\s*m/);
  const seconds = duration.match(/(\d+)\s*s/);

  let parsedSeconds = 0;
  if (days) {
    parsedSeconds += parseInt(days[1], 10) * 86400;
  }
  if (hours) {
    parsedSeconds += parseInt(hours[1], 10) * 3600;
  }
  if (minutes) {
    parsedSeconds += parseInt(minutes[1], 10) * 60;
  }
  if (seconds) {
    parsedSeconds += parseInt(seconds[1], 10);
  }
  return parsedSeconds;
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

/**
 * Create a div with the given text
 * @param text
 * @param className
 * @returns {HTMLDivElement}
 */
export function createTextDiv(text, className: string = 'prun-remove-js') {
  const newSpan = document.createElement('div');
  newSpan.classList.add(className);
  newSpan.textContent = text;
  return newSpan;
}

// Get the data in local storage for a given storageName. Then call the callback function.
// Also pass the params through to the callback function
export function getLocalStorage(storageName, callbackFunction, params?) {
  system.storage.local.get(storageName).then(result => {
    callbackFunction(result, params);
  });
}

// Remove all the children of a given element
export function clearChildren(elem) {
  elem.textContent = '';
  while (elem.children[0]) {
    elem.removeChild(elem.children[0]);
  }
  return;
}

// Set the data in local storage. Pass it the result of a getLocalStorage call
export function setSettings(result) {
  system.storage.local.set(result);
}

/**
 * Make an XML HTTP Request to a service and fill in the tile with that information
 * @param tile - The tile frame on which to show the output
 * @param parameters - The parameters from the XIT bufferDepth
 * @param callbackFunction - The function to call once the request is successful
 * @param url - The URL to be accessed
 * @param requestType - The type of HttpRequest (GET, POST, etc)
 * @param header - A dictionary with 2 key-value pairs "HeaderName": name of header, "HeaderValue": value of header
 * @param content - The content to send in the HttpRequest
 */
export function XITWebRequest(
  tile,
  parameters,
  callbackFunction,
  url,
  requestType: string = 'GET',
  header?,
  content?,
) {
  const xhr = new XMLHttpRequest();
  xhr.ontimeout = function () {
    tile.textContent = 'Error! Data Could Not Be Loaded! Timed Out!';
  };

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      callbackFunction(tile, parameters, xhr.responseText);
    }
    return;
  };
  xhr.timeout = 10000;
  xhr.open(requestType, url, true);
  if (url.includes('fnar')) {
    xhr.setRequestHeader('X-FIO-Application', 'PMMGExtended');
  }
  if (header) {
    xhr.setRequestHeader(header[0], header[1]);
  }
  if (content) {
    xhr.send(content);
  } else {
    xhr.send(null);
  }
  return;
}

export function getSpecial() {
  const now = new Date();
  const edtTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000 - 3600000 * 4);
  return edtTime.getDate() == 1 && edtTime.getMonth() == 3;
}

/**
 * Create a material element that mimics the ones generated by the game
 * @param ticker - The ticker of the MAT
 * @param className - A class that can be applied to the material element
 * @param amount - The number shown in the lower right of the material. "none" indicates no number
 * @param text - Indicates whether the full material name should appear under the material element
 * @param small - Indicates whether the material is full size (as in an inventory) or small (as in a WF buffer)
 * @param building - Indicates whether the material is a building ticker
 */
export function createMaterialElement(
  ticker: string,
  className: string = 'prun-remove-js',
  amount: string = 'none',
  text: boolean = false,
  small: boolean = false,
  building?,
) {
  const material = materialsStore.getByTicker(ticker);
  if (!material && ticker != 'SHPT' && !building) {
    return null;
  } // Return nothing if the material isn't recognized
  const name = getMaterialNameByTicker(ticker) ?? 'Shipment'; // The full name of the material (Basic Bulkhead)
  const category = material ? materialCategoriesStore.getById(material.category)!.name : 'shipment'; // The category of the material

  const matText = createTextSpan(ticker, className); // The ticker text in the middle
  matText.classList.add(...WithStyles(Style.MatText)); // Apply styles

  const matTextWrapper = document.createElement('div'); // The first wrapper around the text
  matTextWrapper.classList.add(...WithStyles(Style.MatTextWrapper)); // Apply styles
  matTextWrapper.appendChild(matText);

  const materialDiv = document.createElement('div'); // The colored material square
  materialDiv.classList.add(...WithStyles(Style.MaterialElement)); // Apply styles
  materialDiv.appendChild(matTextWrapper);
  if (building) {
    materialDiv.style.background = 'linear-gradient(135deg, rgb(52, 140, 160), rgb(77, 165, 185))'; // Apply colors
    materialDiv.style.color = 'rgb(179, 255, 255)';
  } else {
    materialDiv.style.background = CategoryColors[category][0]; // Apply colors
    materialDiv.style.color = CategoryColors[category][1];
    materialDiv.title = name; // Provide the material with a title when hovered over
  } // Provide the material with a title when hovered over
  materialDiv.addEventListener('click', () => {
    // Show MAT buffer when clicked
    showBuffer(`MAT ${ticker.toUpperCase()}`);
  });

  const materialWrapper = document.createElement('div'); // First wrapper around material square
  materialWrapper.classList.add(...WithStyles(Style.MaterialWrapper)); // Apply styles
  materialWrapper.appendChild(materialDiv);

  const materialWrapperWrapper = document.createElement('div'); // Second wrapper around material square
  materialWrapperWrapper.classList.add(...WithStyles(Style.MaterialWrapperWrapper)); // Apply styles
  materialWrapperWrapper.appendChild(materialWrapper);

  const outerLayer = document.createElement('div'); // Final element to be returned (for big case)
  outerLayer.classList.add(...WithStyles(Style.MaterialOuter)); // Apply styles
  outerLayer.classList.add(className);
  outerLayer.appendChild(materialWrapperWrapper);

  if (amount && amount != 'none') {
    // If there is an amount listed
    const materialNumberWrapper = document.createElement('div'); // Wrapper for amount
    materialNumberWrapper.classList.add(...WithStyles(Style.MaterialNumberWrapper)); // Apply styles
    materialWrapper.appendChild(materialNumberWrapper);

    const materialNumber = createTextDiv(amount, className); // Span containing amount
    materialNumber.classList.add(...WithStyles(Style.MaterialNumber)); // Apply styles
    materialNumberWrapper.appendChild(materialNumber);
  }

  if (text) {
    // If the full material name will appear under the element
    const textElemWrapper = document.createElement('span'); // Wrapper around the text
    textElemWrapper.classList.add(...WithStyles(Style.MaterialNameText)); // Apply styles

    const textElem = createTextSpan(name, className); // The text itself
    textElemWrapper.appendChild(textElem); // Apply styles

    outerLayer.appendChild(textElemWrapper);
  }

  if (small) {
    materialWrapper.classList.add('mat-element-small'); // Apply small size
    return materialWrapper; // Small material elements don't need all the wrapping
  }
  materialWrapper.classList.add('mat-element-large'); // Apply large size

  return outerLayer;
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
export function changeValue(input, value) {
  // Get the property descriptor for the input element's value property
  const propDescriptor = Object.getOwnPropertyDescriptor(
    window['HTMLInputElement'].prototype,
    'value',
  );
  // Return if the property descriptor is undefined
  if (propDescriptor == undefined) {
    return;
  }
  // Get the native input value setter
  const nativeInputValueSetter = propDescriptor.set;
  // Return if the native input value setter is undefined
  if (nativeInputValueSetter == undefined) {
    return;
  }
  // Call the native input value setter with the input element and the new value
  nativeInputValueSetter.call(input, value);

  // Create a new input event
  const inputEvent = document.createEvent('Event');
  // Initialize the event as an "input" event, bubbling and cancelable
  inputEvent.initEvent('input', true, true);
  // Dispatch the event to the input element
  input.dispatchEvent(inputEvent);
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

// Create an input row for the editing interface
export function createPopupInputRow(label, text: string = '', tooltip: string = '') {
  const inputRow = document.createElement('div');
  inputRow.classList.add(...Style.FormRow);
  const inputLabel = document.createElement('label');
  inputLabel.textContent = label;
  if (tooltip != '') {
    inputLabel.appendChild(createToolTip(tooltip, 'right'));
  }
  inputLabel.classList.add(...Style.FormLabel);
  inputRow.appendChild(inputLabel);
  const inputInputDiv = document.createElement('div');
  inputInputDiv.classList.add(...Style.FormInput);
  inputRow.appendChild(inputInputDiv);
  const inputInput = document.createElement('input');
  inputInput.style.width = '80%';
  inputInputDiv.appendChild(inputInput);
  inputInput.value = text;
  return inputRow;
}

// Gets the value of the text box in a row in the add interface (should move to util)
export function getValueOfPopupRow(row) {
  if (!row || !row.children[1] || !row.children[1].firstChild) {
    return '';
  }
  return row.children[1].firstChild.value || '';
}

// Creates a small button as in LMOS and CXOS view/delete buttons
export function createSmallButton(label, clickFunction, parameters) {
  const button = document.createElement('button');
  button.textContent = label;
  button.classList.add(...Style.SmallButton);
  button.addEventListener('click', () => {
    clickFunction(...parameters);
  });
  return button;
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

/**
 * Gets one or more items from storage.
 * @param keys - A single key to get, list of keys to get, or a dictionary specifying default values. An empty list or object will return an empty result object. Pass in null to get the entire contents of storage.
 * @returns A Promise that resolves with an object containing items
 */
export function getLocalStoragePromise(keys: string | string[]) {
  return system.storage.local.get(keys);
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
  return await fetch(system.runtime.getURL(path));
}

export async function loadLocalJson(path: string) {
  const file = await loadLocalFile(`json/${path}`);
  return await file.json();
}

// A function to compare two planets (to be used in .sort() functions)
export function comparePlanets(idOrNameA: string, idOrNameB: string) {
  const planetA = planetsStore.getByIdOrName(idOrNameA);
  const planetB = planetsStore.getByIdOrName(idOrNameB);
  if (!planetA) {
    return 1;
  }
  if (!planetB) {
    return -1;
  }
  if (planetA === planetB) {
    return 0;
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
    const isSystemANamed = systemA.name !== getStarNaturalId(systemA);
    const isSystemBNamed = systemB.name !== getStarNaturalId(systemB);

    if (isSystemANamed && !isSystemBNamed) {
      return -1;
    }
    if (isSystemBNamed && !isSystemANamed) {
      return 1;
    }
    if (isSystemANamed && isSystemBNamed && systemA !== systemB) {
      return systemA.name > systemB.name ? 1 : -1;
    }
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

export function extractPlanetName(text?: string | null) {
  if (!text) {
    return undefined;
  }
  text = text
    // Clear parenthesis
    .replace(/\s*\([^)]*\)/, '')
    // Clear space between system and planet
    .replace(/(\d)\s+(?=[a-zA-Z])/, '$1')
    // Clear system name in named systems
    .replace(/.*\s-\s/, '');
  return Stations[text] ?? text;
}

export function changeSelectValue(input, selectIndex) {
  input.selectedIndex = selectIndex;
  // Create a new change event
  const changeEvent = document.createEvent('Event');
  // Initialize the event as an "change" event, bubbling and cancelable
  changeEvent.initEvent('change', true, true);
  // Dispatch the event to the change element
  input.dispatchEvent(changeEvent);
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
