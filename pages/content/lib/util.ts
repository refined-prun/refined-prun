import { Selector } from './Selector';
import { MaterialNames, PlanetNames, SystemNames, Stations } from './GameProperties';
import { Style, CategoryColors, WithStyles, DefaultColors } from './Style';

export const hourFormatter = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' });

export const dateFormatter = new Intl.DateTimeFormat(undefined, { month: '2-digit', day: '2-digit' });

export const dateYearFormatter = new Intl.DateTimeFormat(undefined, {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
});

export const dateYearFormatter2 = new Intl.DateTimeFormat(undefined, {
  month: '2-digit',
  day: '2-digit',
  year: '2-digit',
});

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

// Creates an HTML element from an HTML string
export function createNode(htmlString) {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild as HTMLElement;
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
 * parse a duration into an actual ETA string
 * @param duration
 * @returns {string}
 */
export function convertDurationToETA(parsedSeconds) {
  const eta = new Date();
  const now = new Date();
  eta.setSeconds(eta.getSeconds() + parsedSeconds);
  const diffTime = Math.abs(eta.getTime() - now.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let ret = hourFormatter.format(eta);
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
    parsedSeconds += parseInt(days[1]) * 86400;
  }
  if (hours) {
    parsedSeconds += parseInt(hours[1]) * 3600;
  }
  if (minutes) {
    parsedSeconds += parseInt(minutes[1]) * 60;
  }
  if (seconds) {
    parsedSeconds += parseInt(seconds[1]);
  }
  return parsedSeconds;
}

/**
 * Shorten planet names
 * @param text
 * @returns {string}
 */
export function cleanPlanetName(text: string) {
  text = text.replace(/\s*\([^)]*\)/, ''); // Clear parenthesis
  text = text.replace(/(\d)\s+(?=[a-zA-Z])/, '$1'); // Clear space between system and planet
  text = text.replace(/.*\s-\s/, ''); // Clear system name in named systems

  if (Stations[text]) {
    text = Stations[text];
  }
  return text;
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

/**
 * Create a textbox with larger primary and smaller secondary text inside of a div
 * @param primaryText
 * @param secondaryText
 * @param primaryTextColor
 * @param className
 * @returns {HTMLDivElement}
 */
export function createFinancialTextBox(
  primaryText,
  secondaryText,
  primaryTextColor,
  className: string = 'prun-remove-js',
) {
  const box = document.createElement('div');
  box.classList.add(className);
  box.classList.add('fin-box');
  const primaryTextSpan = document.createElement('span');
  primaryTextSpan.style.fontSize = '12px';
  primaryTextSpan.style.lineHeight = '1.1';
  primaryTextSpan.style.color = primaryTextColor;
  primaryTextSpan.textContent = primaryText;
  box.appendChild(primaryTextSpan);

  const secondaryTextDiv = document.createElement('div');
  secondaryTextDiv.textContent = secondaryText;
  secondaryTextDiv.style.fontSize = '10px';
  secondaryTextDiv.style.lineHeight = '1.1';
  secondaryTextDiv.style.marginTop = '2px';
  secondaryTextDiv.style.color = '#999';
  box.appendChild(secondaryTextDiv);

  return box;
}

// For a material ticker and FIO inventory payload, find the amount of that material in the inventory
export function findInventoryAmount(ticker, inventory) {
  for (let i = 0; i < inventory['Inventory'].length; i++) {
    if (inventory['Inventory'][i]['MaterialTicker'] == ticker) {
      return inventory['Inventory'][i]['MaterialAmount'];
    }
  }
  return 0;
}

// For a material ticker and FIO inventory payload, find the amount of that material consumed by worker consumption
export function findBurnAmount(ticker, inventory) {
  for (let i = 0; i < inventory['WorkforceConsumption'].length; i++) {
    if (inventory['WorkforceConsumption'][i]['MaterialTicker'] == ticker) {
      return inventory['WorkforceConsumption'][i]['DailyAmount'];
    }
  }
  return 0;
}

// Sort tickers by their material category
export function CategorySort(a, b) {
  if (!MaterialNames[a] || !MaterialNames[b]) {
    return 0;
  }
  return MaterialNames[a][1].localeCompare(MaterialNames[b][1]);
}

// Find the data corresponding to a planet in an array of FIO inventory/burn data
export function findCorrespondingPlanet(planet, data, needBase?) {
  if (!data || !planet) {
    return undefined;
  }
  for (let i = 0; i < data.length; i++) {
    if (
      planet &&
      data[i]['PlanetNaturalId'] &&
      data[i]['PlanetNaturalId'].toLowerCase() == planet.toLowerCase() &&
      (!needBase || data[i]['type'] == 'STORE' || data[i]['type'] == 'BASE')
    ) {
      // If the natural ID matches: XX-000x
      return data[i];
    } else if (
      planet &&
      data[i]['PlanetName'] &&
      data[i]['PlanetName'].toLowerCase() == planet.toLowerCase() &&
      (!needBase || data[i]['type'] == 'STORE' || data[i]['type'] == 'BASE')
    ) {
      // If the planet name matches
      return data[i];
    } else if (
      planet &&
      data[i]['PlanetNaturalId'] &&
      PlanetNames[planet] &&
      PlanetNames[planet].toLowerCase() == data[i]['PlanetNaturalId'].toLowerCase() &&
      (!needBase || data[i]['type'] == 'STORE' || data[i]['type'] == 'BASE')
    ) {
      // When planet name isn't in the payload, convert it to natural ID
      return data[i];
    }
  }
  return undefined;
}

// Parse the base name on WF buffers
export function parseBaseName(text) {
  try {
    let match = text.match(/@ ([A-Z]{2}-[0-9]{3} [a-z]) Base/); // Unnamed system unnamed planet
    if (match && match[1]) {
      return match[1].replace(' ', '');
    }
    match = text.match(/@ ([A-z ]*) - ([A-z ]*) Base/); // Named system named planet
    if (match && match[1] && match[2]) {
      return match[2];
    }
    match = text.match(/@ ([A-z ]*) ([A-z]) Base/); // Named system unnamed planet
    if (match && match[1] && match[2] && SystemNames[match[1].toUpperCase()]) {
      return SystemNames[match[1].toUpperCase()] + match[2].toLowerCase();
    }
    match = text.match(/@ [A-Z]{2}-[0-9]{3} - ([A-z ]*) Base/); // Unnamed system named planet
    if (match && match[1]) {
      return match[1];
    }
    return null;
  } catch (TypeError) {
    return text;
  }
}

// Parse the inventory name on inventory buffers
export function parseInvName(text) {
  try {
    const match = text.split(' ');
    if (match && match[1]) {
      return match[1];
    }
    return null;
  } catch (TypeError) {
    return null;
  }
}

// Parse the planet name on inventory buffers
export function parsePlanetName(text) {
  try {
    const match = text.match(/\((.*?)\)/);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  } catch (TypeError) {
    return null;
  }
}

// Get the data in local storage for a given storageName. Then call the callback function.
// Also pass the params through to the callback function
export function getLocalStorage(storageName, callbackFunction, params?) {
  try {
    browser.storage.local.get(storageName).then(function (result) {
      callbackFunction(result, params);
    }); // For FireFox, throws an error in Chrome
  } catch (err) {
    chrome.storage.local.get([storageName], function (result) {
      // For Chrome, doesn't work in FireFox
      callbackFunction(result, params);
    });
  }
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
  try {
    browser.storage.local.set(result); // For FireFox, throws an error in Chrome
  } catch (err) {
    chrome.storage.local.set(result, function () {
      // For Chrome, doesn't work in FireFox
      //console.log("PMMG: Configuration Saved.");
    });
  }
  return;
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
export function XITWebRequest(tile, parameters, callbackFunction, url, requestType: string = 'GET', header?, content?) {
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
  const specialTime = edtTime.getDate() == 1 && edtTime.getMonth() == 3;
  //const specialTime = edtTime.getDate() == 28 && edtTime.getMonth() == 2;
  return specialTime;
}

/**
 * Create a material element that mimics the ones generated by the game
 * @param ticker - The ticker of the MAT
 * @param className - A class that can be applied to the material element
 * @param amount - The number shown in the lower right of the material. "none" indicates no number
 * @param text - Indicates whether the full material name should appear under the material element
 * @param small - Indicates whether the material is full size (as in an inventory) or small (as in a WF buffer)
 */
export function createMaterialElement(
  ticker,
  className: string = 'prun-remove-js',
  amount: string = 'none',
  text: boolean = false,
  small: boolean = false,
) {
  if (!MaterialNames[ticker] && ticker != 'SHPT') {
    return null;
  } // Return nothing if the material isn't recognized
  const name = (MaterialNames[ticker] || ['Shipment'])[0]; // The full name of the material (Basic Bulkhead)
  const category = (MaterialNames[ticker] || [undefined, 'shipment'])[1]; // The category of the material

  const matText = createTextSpan(ticker, className); // The ticker text in the middle
  matText.classList.add(...WithStyles(Style.MatText)); // Apply styles

  const matTextWrapper = document.createElement('div'); // The first wrapper around the text
  matTextWrapper.classList.add(...WithStyles(Style.MatTextWrapper)); // Apply styles
  matTextWrapper.appendChild(matText);

  const material = document.createElement('div'); // The colored material square
  material.classList.add(...WithStyles(Style.MaterialElement)); // Apply styles
  material.appendChild(matTextWrapper);
  material.style.background = CategoryColors[category][0]; // Apply colors
  material.style.color = CategoryColors[category][1];
  material.title = name; // Provide the material with a title when hovered over
  material.addEventListener('click', function () {
    // Show MAT buffer when clicked
    showBuffer('MAT ' + ticker.toUpperCase());
  });

  const materialWrapper = document.createElement('div'); // First wrapper around material square
  materialWrapper.classList.add(...WithStyles(Style.MaterialWrapper)); // Apply styles
  materialWrapper.appendChild(material);

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
  } else {
    materialWrapper.classList.add('mat-element-large'); // Apply large size
  }
  return outerLayer;
}

// Creates an element that links to a buffer with command "command"
export function createLink(text, command, autoSubmit = true) {
  const link = document.createElement('span');
  link.textContent = text;
  link.addEventListener('click', function () {
    showBuffer(command, autoSubmit);
  });

  const linkDiv = document.createElement('div');
  linkDiv.classList.add('link');
  linkDiv.appendChild(link);
  return linkDiv;
}

// Shows a buffer with a specified command
export function showBuffer(command, autoSubmit = true) {
  const button = document.getElementById(Selector.NewBFRButton);
  if (button == null) {
    return false;
  }

  const addSubmitCommand = (input, cmd) => {
    changeValue(input, cmd);
    if (autoSubmit) {
      input.parentElement.parentElement.requestSubmit();
    }
  };

  // Watch for future buffer creation
  monitorOnElementCreated(Selector.BufferTextField, elem => addSubmitCommand(elem, command));

  // Create new Buffer
  button.click();
  return true;
}

// Change the value of a new buffer box
export function changeValue(input, value) {
  // Get the property descriptor for the input element's value property
  const propDescriptor = Object.getOwnPropertyDescriptor(window['HTMLInputElement'].prototype, 'value');
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

// Change the value of a select box
export function changeSelectValue(input, value) {
  // Get the property descriptor for the input element's value property
  const propDescriptor = Object.getOwnPropertyDescriptor(window['HTMLSelectElement'].prototype, 'value');
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

// Wait for a new buffer to be created
export function monitorOnElementCreated(selector, callback, onlyOnce = true) {
  const getElementsFromNodes = nodes =>
    Array.from(nodes)
      .flatMap(node =>
        (node as Node).nodeType === 3 ? null : Array.from((node as HTMLElement).querySelectorAll(selector)),
      )
      .filter(item => item !== null);
  const onMutationsObserved = function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length) {
        const elements = getElementsFromNodes(mutation.addedNodes);
        for (let i = 0, len = elements.length; i < len; i++) {
          callback(elements[i]);
          if (onlyOnce) observer.disconnect();
        }
      }
    });
  };

  const containerSelector = 'body';
  const target = document.querySelector(containerSelector);
  if (!target) {
    return;
  }
  const config = { childList: true, subtree: true };
  const MutationObserver = window['MutationObserver'] || window['WebKitMutationObserver'];
  const observer = new MutationObserver(onMutationsObserved);
  observer.observe(target as Node, config);
  return;
}

// Remove all elements added in the last run with a class name
export function genericCleanup(className: string = 'prun-remove-js') {
  Array.from(document.getElementsByClassName(className)).forEach(elem => {
    elem.parentNode && elem.parentNode.removeChild(elem);
    return;
  });
  return;
}

export function genericUnhide(className: string = 'prun-remove-js') {
  (<HTMLElement[]>Array.from(document.getElementsByClassName(className + '-hidden'))).forEach((elem: HTMLElement) => {
    elem.style.display = '';
    elem.classList.remove(className + '-hidden');
    return;
  });
  return;
}

// Remove all elements from an HTML Element added in the last run with a class name
export function targetedCleanup(className: string, element: Element) {
  Array.from(element.getElementsByClassName(className)).forEach(elem => {
    elem.parentNode && elem.parentNode.removeChild(elem);
    return;
  });
  return;
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
  const matchingBuffers = buffers
    .filter(([firstElement]) => firstElement.toLowerCase().startsWith(bufferCode.toLowerCase()))
    .map(([, secondElement]) => secondElement);

  return matchingBuffers;
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

// Get elements that match an XPath
export function getElementsByXPath(xpath: string): Array<Node> {
  const result = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);

  const output: Array<Node> = [];

  try {
    let node = result.iterateNext();
    while (node) {
      output.push(node);
      node = result.iterateNext();
    }
  } catch (e) {
    // ignored
  }
  return output;
}

// Sort type is: alph, alphRev
export function sortTable(table: HTMLTableElement, column: number, sortType: string) {
  const sorter = [] as any[];
  if (table.children[1] == null) {
    return;
  }
  const rows = Array.from(table.children[1].children);
  for (let i = 0; i < rows.length; i++) {
    const item = rows[i].children[column];
    if (item == null || item.firstChild == null) {
      break;
    }
    sorter.push([item.firstChild.textContent, rows[i]]);
  }
  if (sortType == 'alph') {
    sorter.sort(tableSortAlph);
  }
  sorter.forEach(item => {
    table.children[1].insertBefore(table.children[1].children[0], item[1]);
  });
}

function tableSortAlph(a, b) {
  return a[0].localeCompare(b[0]);
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
  spacer.addEventListener('click', function () {
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

// Create an checkbox input row for the editing interface
export function createPopupCheckboxRow(label, enabled: boolean = false, tooltip: string = '') {
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
  inputInput.type = 'checkbox';
  inputInputDiv.appendChild(inputInput);
  inputInput.checked = enabled;
  return inputRow;
}

// Gets the value of the text box in a row in the add interface (should move to util)
export function getValueOfPopupRow(row) {
  if (!row || !row.children[1] || !row.children[1].firstChild) {
    return '';
  } else {
    return row.children[1].firstChild.value || '';
  }
}

// Gets the checked status of a check box in a row in the add interface (should move to util)
export function getCheckOfPopupRow(row) {
  if (!row || !row.children[1] || !row.children[1].firstChild) {
    return false;
  } else {
    return (row.children[1].firstChild as HTMLInputElement).checked || false;
  }
}

// Creates a small button as in LMOS and CXOS view/delete buttons
export function createSmallButton(label, clickFunction, parameters) {
  const button = document.createElement('button');
  button.textContent = label;
  button.classList.add(...Style.SmallButton);
  button.addEventListener('click', function () {
    clickFunction(...parameters);
  });
  return button;
}

export function createContractDict(contracts, contractdict) {
  for (let i = 0; i < contracts.length; i++) {
    const element = contracts[i];
    contractdict[element['localId']] = element;
  }
}

// Calculate burn
export function calculateBurn(production, workforce, inventory) {
  const burnDict = {};

  if (production && production.lines) {
    production.lines.forEach(line => {
      const numLines = line.capacity;
      let hasRecurring = false;
      let totalDuration = 0;
      line.orders.forEach(order => {
        if (!order.started) {
          // Only account for orders in the queue.
          hasRecurring = hasRecurring || order.recurring;
        }
      });
      line.orders.forEach(order => {
        if (!order.started && (!hasRecurring || order.recurring)) {
          // Only account for orders in the queue.
          totalDuration += order.duration;
        }
      });
      totalDuration /= 86400000; // Convert to days

      line.orders.forEach(order => {
        if (!order.started && (!hasRecurring || order.recurring)) {
          order.outputs.forEach(mat => {
            if (burnDict[mat['MaterialTicker']]) {
              burnDict[mat['MaterialTicker']]['DailyAmount'] += (mat['Amount'] * numLines) / totalDuration;
            } else {
              burnDict[mat['MaterialTicker']] = {
                DailyAmount: (mat['Amount'] * numLines) / totalDuration,
                Inventory: 0,
                DaysLeft: 0,
                Type: 'output',
              };
            }
          });
          order.inputs.forEach(mat => {
            if (burnDict[mat['MaterialTicker']]) {
              burnDict[mat['MaterialTicker']]['DailyAmount'] -= (mat['Amount'] * numLines) / totalDuration;
              if (burnDict[mat['MaterialTicker']]['Type'] == 'output') {
                burnDict[mat['MaterialTicker']]['Type'] = 'input';
              }
            } else {
              burnDict[mat['MaterialTicker']] = {
                DailyAmount: (-mat['Amount'] * numLines) / totalDuration,
                Inventory: 0,
                DaysLeft: 0,
                Type: 'input',
              };
            }
          });
        }
      });
    });
  }

  if (workforce && workforce.workforce) {
    workforce.workforce.forEach(tier => {
      // Loop over all 5 tiers of workers
      if (tier.population > 1) {
        // Don't count the one bugged population
        tier.needs.forEach(need => {
          const ticker = need.material.ticker;
          if (burnDict[ticker]) {
            burnDict[ticker]['DailyAmount'] -= need.unitsPerInterval;
            burnDict[ticker]['Type'] = 'workforce';
          } else {
            burnDict[ticker] = {
              DailyAmount: -need.unitsPerInterval,
              Inventory: 0,
              DaysLeft: 0,
              Type: 'workforce',
            };
          }
        });
      }
    });
  }

  if (inventory && inventory.items) {
    inventory.items.forEach(item => {
      if (burnDict[item.MaterialTicker]) {
        // Only care about items that are burned, not other inventory items
        burnDict[item.MaterialTicker]['Inventory'] += item.Amount;
        if (item.Amount != 0) {
          burnDict[item.MaterialTicker]['DaysLeft'] =
            burnDict[item.MaterialTicker]['DailyAmount'] > 0
              ? 1000
              : Math.floor(-burnDict[item.MaterialTicker]['Inventory'] / burnDict[item.MaterialTicker]['DailyAmount']);
        }
      }
    });
  }

  return burnDict;
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

  cancelButton.addEventListener('click', function () {
    // Just remove the overlay to cancel
    displayTile.removeChild(overlay);
    return;
  });

  confirmButton.addEventListener('click', function () {
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

  overlay.addEventListener('click', function () {
    // Just remove the overlay to dismiss
    displayTile.removeChild(overlay);
    return;
  });

  return;
}

export function drawLineChart(xData, yData, xSize, ySize, xLabel?, yLabel?, lineColor?, isDates?, currencySymbol?) {
  const canvas = document.createElement('canvas');
  canvas.height = ySize;
  canvas.width = xSize;

  const context = canvas.getContext('2d');
  if (!context) {
    return null;
  }

  const minX = Math.min(...xData);
  const maxX = Math.max(...xData);
  const minY = Math.min(...yData);
  const maxY = Math.max(...yData);

  const zeroX =
    (xLabel ? 25 : 0) + context.measureText(maxY.toLocaleString(undefined, { maximumFractionDigits: 0 })).width;
  const zeroY = yLabel ? ySize - 23 : ySize;

  // Draw labels
  if (xLabel) {
    const xLabelInfo = context.measureText(xLabel);
    context.font = '12px Droid Sans';
    context.fillStyle = '#eee';
    context.fillText(xLabel, xSize / 2 + zeroX / 2 - xLabelInfo.width / 2, ySize);
  }
  if (yLabel) {
    context.save();
    context.font = '12px Droid Sans';
    context.fillStyle = '#eee';
    context.translate(10, ySize / 2 + 10);
    context.rotate(-Math.PI / 2);
    context.fillText(yLabel, 0, 0);
    context.restore();
  }

  // Draw data
  const scaleX = (xSize - zeroX) / (maxX - minX);
  const scaleY = zeroY / (maxY - minY);

  for (var i = 0; i < xData.length - 1; i++) {
    context.beginPath();
    context.moveTo((xData[i] - minX) * scaleX + zeroX, zeroY - (yData[i] - minY) * scaleY);
    context.lineTo((xData[i + 1] - minX) * scaleX + zeroX, zeroY - (yData[i + 1] - minY) * scaleY);
    context.strokeStyle = lineColor ? lineColor : '#f7a600';
    context.stroke();
  }

  // Draw axes
  context.beginPath();
  context.strokeStyle = '#bbb';
  context.moveTo(zeroX, zeroY);
  context.lineTo(xSize, zeroY);
  context.stroke();

  context.beginPath();
  context.moveTo(zeroX, zeroY);
  context.lineTo(zeroX, 0);
  context.stroke();

  // Draw data labels
  for (i = 0; i < 10; i++) {
    const text = isDates
      ? dateFormatter.format(new Date(((maxX - minX) * i) / 10 + minX))
      : (((maxX - minX) * i) / 10 + minX).toLocaleString(undefined, { maximumFractionDigits: 2 });
    context.font = '10px Droid Sans';
    context.fillStyle = '#999';
    context.fillText(text, ((xSize - zeroX) * i) / 10 + zeroX, ySize - 12);
  }

  for (i = 0; i <= 5; i++) {
    let value = ((maxY - minY) * i) / 5 + minY;
    value =
      Math.round(value / Math.pow(10, Math.floor(Math.log10(value)) - 3)) *
      Math.pow(10, Math.floor(Math.log10(value)) - 3);
    const text = (currencySymbol ? currencySymbol : '') + value.toLocaleString(undefined, { maximumFractionDigits: 0 });
    const textInfo = context.measureText(text);
    context.font = '10px Droid Sans';
    context.fillStyle = '#999';
    context.fillText(text, zeroX - textInfo.width - 2, (-(zeroY - 8) * i) / 5 + zeroY);
  }

  return canvas;
}

export function drawPieChart(data, size, text?, colors?) {
  const pieSize = size / 2 - 12;
  const centerX = size * 1.5;
  const centerY = size / 2 + 12;
  let angle = 0;
  let sum = 0;
  data.forEach(point => {
    sum += point;
  });
  const canvas = document.createElement('canvas');
  canvas.height = size + 24;
  canvas.width = size * 3;

  const context = canvas.getContext('2d');
  if (!context) {
    return null;
  }

  for (var i = 0; i < data.length; i++) {
    const pieAngle = (data[i] / sum) * 2 * Math.PI;
    context.beginPath();
    context.arc(centerX, centerY, pieSize, angle, angle + pieAngle);
    context.stroke();
    angle += pieAngle;

    context.lineTo(centerX, centerY);

    if (colors) {
      context.fillStyle = colors[i] || '#00ff00';
    } else {
      context.fillStyle =
        i == data.length - 1 && data.length % DefaultColors.length == 1 && data.length > 1
          ? DefaultColors[1]
          : DefaultColors[i % DefaultColors.length];
    }
    context.fill();
  }
  if (!text) {
    return canvas;
  }

  angle = 0;
  let minX = centerX - pieSize;
  let maxX = centerX + pieSize;
  for (var i = 0; i < data.length; i++) {
    const pieAngle = (data[i] / sum) * 2 * Math.PI;
    const percent = ' - ' + ((data[i] / sum) * 100).toLocaleString(undefined, { maximumFractionDigits: 0 }) + '%';
    const textInfo = context.measureText(text[i] + percent);

    if (pieAngle < 0.3 && data.length > 5) {
      continue;
    }

    let startX = centerX + (Math.cos(angle + pieAngle / 2) * size) / 2;
    const startY = centerY + (Math.sin(angle + pieAngle / 2) * size) / 2 + 4;

    if (startX - textInfo.width < minX) {
      minX = startX - textInfo.width;
    } else if (startX + textInfo.width > maxX) {
      maxX = startX + textInfo.width;
    }

    if (angle + pieAngle / 2 > Math.PI / 2 && angle + pieAngle / 2 < (Math.PI * 3) / 2) {
      startX -= textInfo.width;
    }

    context.font = '12px Droid Sans';
    context.fillStyle = '#eee';
    context.fillText(text[i] + percent, startX, startY);

    angle += pieAngle;
  }

  canvas.style.marginLeft = (minX > 0 ? -minX + 5 : 5).toString() + 'px';
  canvas.style.marginRight = (maxX - 2 * size + 5).toString() + 'px';
  return canvas;
}

/**
 * Gets one or more items from storage.
 * @param keys - A single key to get, list of keys to get, or a dictionary specifying default values. An empty list or object will return an empty result object. Pass in null to get the entire contents of storage.
 * @returns A Promise that resolves with an object containing items
 */
export function getLocalStoragePromise(keys: string | string[]) {
  try {
    return browser.storage.local.get(keys);
  } catch (err) {
    return chrome.storage.local.get(keys);
  }
}

/**
 * Sets multiple items in localStorage.
 * @param items - An object which gives each key/value pair to update storage with. Any other key/value pairs in storage will not be affected. Primitive values such as numbers will serialize as expected. Values with a typeof "object" and "function" will typically serialize to {}, with the exception of Array (serializes as expected), Date, and Regex (serialize using their String representation).
 * @returns A void Promise
 */
export function setLocalStoragePromise(items: { [p: string]: any }) {
  let promise;

  try {
    promise = browser.storage.local.set(items);
  } catch (err) {
    promise = chrome.storage.local.set(items);
  }

  return promise;
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
        this.rowInput.addEventListener('input', function () {
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

      this.rowInput.name = 'popup-dropdown' + Math.floor(Math.random() * 10000).toString();
      this.rowInput.id = 'popup-dropdown' + Math.floor(Math.random() * 10000).toString();

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
        this.rowInput.addEventListener('change', function () {
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
        this.rowInput.addEventListener('click', function () {
          callback(params);
        });
      }
    }
  }
}

export function getExtensionResource(path: string): string {
  if (chrome !== undefined) {
    return chrome.runtime.getURL(path);
  } else {
    return browser.runtime.getURL(path);
  }
}
