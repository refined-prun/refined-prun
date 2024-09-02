import { createMaterialElement, setSettings, showBuffer, targetedCleanup } from '@src/util';
import { Style } from '@src/Style';
import { SortingTriangleHTML } from '@src/GameProperties';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { BurnValues, calculatePlanetBurn } from '@src/core/burn';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import buffers from '@src/infrastructure/prun-ui/prun-buffers';
import features from '@src/feature-registry';
import { getXitArgs } from '@src/features/XIT/xit-commands';
import descendantPresent from '@src/utils/descendant-present';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { _$, _$$ } from '@src/utils/get-element-by-class-name';

const tag = 'pb-inv-org';

async function onInvReady(buffer: PrunBuffer) {
  const invName = buffer.parameter;
  if (!invName) {
    return;
  }
  const screenName = getScreenName();
  const sortOptions = await descendantPresent(buffer.frame, PrunCss.InventorySortControls.controls);
  const inventory = await descendantPresent(buffer.frame, PrunCss.InventoryView.grid);
  if (inventory.classList.contains('pb-monitored')) {
    return;
  }
  inventory.classList.add('pb-monitored');

  const storage = storagesStore.getByShortId(invName);
  const site = sitesStore.getById(storage?.addressableId);
  const workforce = workforcesStore.getById(site?.siteId)?.workforces;
  const production = productionStore.getBySiteId(site?.siteId);
  const stores = storagesStore.getByAddress(site?.siteId);
  let burn: BurnValues | undefined = undefined;
  if (workforce) {
    burn = calculatePlanetBurn(production, workforce, stores);
  }

  sortInventory(inventory, sortOptions, screenName, invName, burn);
  const observer = new MutationObserver(() => {
    observer.disconnect();
    setTimeout(() => {
      observer.observe(inventory, { childList: true, subtree: true });
    }, 250); // Just chill...
    targetedCleanup(tag, inventory); // Cleanup old sorting stuff
    sortInventory(inventory, sortOptions, screenName, invName, burn); // Now apply sorting and sorting select options
  });
  observer.observe(inventory, { childList: true, subtree: true });
}

async function onShpiReady(buffer: PrunBuffer) {
  const shipName = buffer.parameter;
  if (!shipName) {
    return;
  }
  const screenName = getScreenName();
  const sortOptions = await descendantPresent(buffer.frame, PrunCss.InventorySortControls.controls);
  const inventory = await descendantPresent(buffer.frame, PrunCss.InventoryView.grid);

  if (inventory.classList.contains('pb-monitored')) {
    return;
  }
  inventory.classList.add('pb-monitored');

  sortInventory(inventory, sortOptions, screenName, shipName, undefined);
  const observer = new MutationObserver(() => {
    observer.disconnect();
    setTimeout(() => {
      observer.observe(inventory, { childList: true, subtree: true });
    }, 250); // Just chill...
    targetedCleanup(tag, inventory); // Cleanup old sorting stuff
    sortInventory(inventory, sortOptions, screenName, shipName, undefined); // Now apply sorting and sorting select options
    return;
  });
  observer.observe(inventory, { childList: true, subtree: true });
}

function getScreenName() {
  const name = _$(PrunCss.ScreenControls.currentScreenName);
  return name?.textContent ? name.textContent : '';
}

/**
 *  Apply sorting and sorting select options
 *  inventory: Inventory element containing materials
 *  sortOptions: The list of sorting option elements
 *  result: The saved settings for PMMGExtended
 *  tag: The tag for this class
 *  screenName: The name of the screen
 *  invName: The encoded name of the inventory
 *  burn: The burn for the planet (or undefined if it does not exist)
 **/
function sortInventory(
  inventory: HTMLElement,
  sortOptions: HTMLElement,
  screenName: string,
  invName: string,
  burn: BurnValues | undefined,
) {
  const result = getXitArgs().pmmgSettings;
  if (sortOptions.children.length <= 7) {
    // The length will be <=7 if no additional sorting options have been added
    // So act and create necessary elements
    for (const option of Array.from(sortOptions.children) as HTMLElement[]) {
      // For each of the stock options...
      if (option !== sortOptions.firstChild && !option.classList.contains('pb-toggle')) {
        // Except the first one, excluding any ones created
        option.addEventListener('click', () => {
          // Add a function on click to disable custom sort and revert to stock sort
          if (option.children[1]) {
            // Reveal the arrow if it was hidden
            (option.children[1] as HTMLElement).style.display = 'inline';
          }
          for (const optionInner of Array.from(sortOptions.children) as HTMLElement[]) {
            // Look through each sortion option
            if (optionInner.children[1] && optionInner.classList.contains('pb-toggle')) {
              // Find ones that are selected and are custom sort options
              optionInner.removeChild(optionInner.children[1]); // Remove the dot
              for (const sortSettings of result['PMMGExtended']['selected_sorting']) {
                // Find the corresponding entry in the settings and set that to nothing
                if (sortSettings[0] === screenName + invName) {
                  sortSettings[1] = '';
                  setSettings(result);
                }
              }
            }
          }

          if (inventory.firstChild) {
            inventory.insertBefore(inventory.firstChild, inventory.firstChild);
          }
          return;
        });
      }
    }
    if (burn) {
      // If there is burn data for this inventory, add the burn sorting option
      sortOptions.appendChild(
        createToggle(
          result,
          sortOptions,
          'BRN',
          findIfActive(result['PMMGExtended']['selected_sorting'], screenName + invName, 'BRN'),
          screenName + invName,
          inventory,
        ),
      );
    }
    for (const settings of result['PMMGExtended']['sorting']) {
      // For each setting for this inventory, create a button
      if (!settings[0] || !settings[1] || !settings[2]) {
        continue;
      }
      if (settings[1].toUpperCase() !== invName.toUpperCase()) {
        continue;
      }
      sortOptions.appendChild(
        createToggle(
          result,
          sortOptions,
          settings[0],
          findIfActive(
            result['PMMGExtended']['selected_sorting'],
            screenName + invName,
            settings[0],
          ),
          screenName + invName,
          inventory,
        ),
      );
    }
  }

  if (
    sortOptions.children[sortOptions.children.length - 1] &&
    (sortOptions.children[sortOptions.children.length - 1] as HTMLElement).textContent !== '+'
  ) {
    // Create the plus button to open the sorting option editing inventory
    const addButton = document.createElement('div');
    addButton.classList.add(PrunCss.InventorySortControls.criteria);
    sortOptions.appendChild(addButton);
    const addLabel = document.createElement('div');
    addLabel.textContent = '+';
    addButton.appendChild(addLabel);
    addButton.addEventListener('click', () => {
      showBuffer(`XIT SORT ${invName}`);
      return;
    });
  }
  // End of stuff that only runs once on buffer creation

  // Move onto sorting the materials, this will run every iteration
  let activeSort = ''; // Which sorting option is active
  for (const sortSettings of result['PMMGExtended']['selected_sorting']) {
    // Iterate through settings until the screen and inventory name combination is found
    if (sortSettings[0] === screenName + invName) {
      activeSort = sortSettings[1];
    }
  }

  // Update circles live
  for (const option of Array.from(sortOptions.children) as HTMLElement[]) {
    // For each sorting option
    if (
      option !== sortOptions.firstChild &&
      option.firstChild &&
      option.firstChild.textContent === activeSort &&
      !option.children[1]
    ) {
      // Test if it is the button corresponding to the active sort
      // Add the triangle next to it
      const toggleIndicator = document.createElement('div');
      toggleIndicator.innerHTML = SortingTriangleHTML;
      toggleIndicator.style.marginLeft = '2px';
      option.appendChild(toggleIndicator);
    } else if (
      option.firstChild &&
      option.firstChild.textContent !== activeSort &&
      option.children[1]
    ) {
      // If the button does not correspond to the active sort, remove the arrow or circle
      if (option.classList.contains('pb-toggle')) {
        option.removeChild(option.children[1]); // Remove the circle
      } else if (activeSort !== '') {
        (option.children[1] as HTMLElement).style.display = 'none'; // Hide the arrow if custom sort is active
      } else {
        (option.children[1] as HTMLElement).style.display = 'inline'; // Show the arrow if custom sort is inactive
      }
    }
  }

  if (activeSort === '') {
    return;
  } // No sorting to do, stock option selected

  const materials = _$$(PrunCss.GridItemView.container, inventory);
  materials.sort(materialDivSort); // Sort the material elements by category primarily, then by ticker secondarily

  let sorted = [] as string[]; // A list of all the material tickers already sorted into categories
  let sortingDetails = []; // The details of which materials to put in which category [[catName, [MAT1, MAT2]], [catName2, [MAT3, MAT4]]]
  for (const result_sortingDetails of result['PMMGExtended']['sorting']) {
    // Search through each option in the settings
    if (result_sortingDetails[0] === activeSort && result_sortingDetails[1] === invName) {
      // If it matches, assign it to sortingDetails
      sortingDetails = result_sortingDetails;
    }
  }

  if (activeSort !== 'BRN') {
    if (sortingDetails.length < 3) {
      return;
    } // No sorting to do

    if (sortingDetails[4]) {
      let materialsToSort = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const category of sortingDetails[2] as any[]) {
        materialsToSort = materialsToSort.concat(category[1]);
      }
      materialsToSort = materialsToSort.filter((c, index) => {
        return materialsToSort.indexOf(c) === index;
      });

      for (const ticker of materialsToSort) {
        if (!materialListContains(materials, ticker)) {
          const matElement = createMaterialElement(ticker, tag, '0', true, false);
          if (!matElement) {
            continue;
          }
          const matQuantityElem = _$(PrunCss.MaterialIcon.indicator, matElement);
          if (matQuantityElem) {
            matQuantityElem.style.color = '#cc0000';
          }
          materials.push(matElement);
        }
      }
      materials.sort(materialDivSort);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const category of sortingDetails[2] as any[]) {
      // For each sorting category...
      // Add a header
      const categoryTitle = document.createElement('h3');
      categoryTitle.appendChild(document.createTextNode(category[0]));
      categoryTitle.classList.add(...Style.SidebarSectionHead);
      categoryTitle.style.width = '100%';
      categoryTitle.classList.add(tag);
      inventory.appendChild(categoryTitle);
      let areItemsInCategory = false; // Keep track if there are any elements in that category
      for (const material of materials) {
        // For each material in the inventory...
        const tickerElem = _$(PrunCss.ColoredIcon.label, material);
        if (!tickerElem) {
          continue;
        }
        const ticker = tickerElem.textContent;
        if (ticker && category[1].includes(ticker) && !sorted.includes(ticker)) {
          // If the ticker is in that category and hasn't been sorted already
          inventory.appendChild(material); // Add it to the bottom of the inventory
          areItemsInCategory = true;
        }
      }
      if (!areItemsInCategory) {
        inventory.removeChild(categoryTitle);
      } // If there are no items in that category, return
      sorted = sorted.concat(category[1]); // Add the list of materials just sorted to the list of materials that have been sorted
    }
  }

  if (sortingDetails[3] || activeSort === 'BRN') {
    // If burn sorting is enabled as a subsort
    if (burn) {
      const workforceMaterials = extractMaterials(burn, 'workforce'); // Get a list of all the materials in each category
      const inputMaterials = extractMaterials(burn, 'input');
      const outputMaterials = extractMaterials(burn, 'output');

      // Create the category for workforce consumables
      const workforceTitle = document.createElement('h3');
      workforceTitle.appendChild(document.createTextNode('Consumables'));
      workforceTitle.classList.add(...Style.SidebarSectionHead);
      workforceTitle.style.width = '100%';
      workforceTitle.classList.add(tag);
      inventory.appendChild(workforceTitle);
      let areConsumables = false; // Test if any materials in that category exist
      for (const material of materials) {
        // For each material in the inventory...
        const tickerElem = _$(PrunCss.ColoredIcon.label, material);
        if (!tickerElem) {
          continue;
        }
        const ticker = tickerElem.textContent;
        if (
          ticker &&
          workforceMaterials.includes(ticker) &&
          !inputMaterials.includes(ticker) &&
          !outputMaterials.includes(ticker) &&
          !sorted.includes(ticker)
        ) {
          // Test if the ticker is a consumable, but is not an input or output
          inventory.appendChild(material); // Move it to the end of the list
          areConsumables = true;
        }
      }
      if (!areConsumables) {
        inventory.removeChild(workforceTitle);
      } // If no items in that category exist, remove the header

      // Create the category for inputs
      const inputTitle = document.createElement('h3');
      inputTitle.appendChild(document.createTextNode('Inputs'));
      inputTitle.classList.add(...Style.SidebarSectionHead);
      inputTitle.style.width = '100%';
      inputTitle.classList.add(tag);
      inventory.appendChild(inputTitle);
      let areInputs = false; // Test if any materials in that category exist
      for (const material of materials) {
        // For each material in the inventory...
        const tickerElem = _$(PrunCss.ColoredIcon.label, material);
        if (!tickerElem) {
          continue;
        }
        const ticker = tickerElem.textContent;
        if (ticker && inputMaterials.includes(ticker) && !sorted.includes(ticker)) {
          // Test if the ticker is an input
          inventory.appendChild(material); // Move it to the end of the list
          areInputs = true;
        }
      }
      if (!areInputs) {
        inventory.removeChild(inputTitle);
      } // If no items in that category exist, remove the header

      // Create the category for outputs
      const outputTitle = document.createElement('h3');
      outputTitle.appendChild(document.createTextNode('Outputs'));
      outputTitle.classList.add(...Style.SidebarSectionHead);
      outputTitle.style.width = '100%';
      outputTitle.classList.add(tag);
      inventory.appendChild(outputTitle);
      let areOutputs = false; // Test if any materials in that category exist
      for (const material of materials) {
        // For each material in the inventory...
        const tickerElem = _$(PrunCss.ColoredIcon.label, material);
        if (!tickerElem) {
          continue;
        }
        const ticker = tickerElem.textContent;
        if (
          ticker &&
          outputMaterials.includes(ticker) &&
          !inputMaterials.includes(ticker) &&
          !sorted.includes(ticker)
        ) {
          // Test if the ticker is an output, but not an input
          inventory.appendChild(material); // Move it to the end of the list
          areOutputs = true;
        }
      }
      if (!areOutputs) {
        inventory.removeChild(outputTitle);
      } // If no items in that category exist, remove the header
      sorted = sorted.concat(workforceMaterials);
      sorted = sorted.concat(inputMaterials);
      sorted = sorted.concat(outputMaterials);
    }
  }
  // Add a header for misc
  const miscTitle = document.createElement('h3');
  miscTitle.appendChild(document.createTextNode('Other'));
  miscTitle.classList.add(...Style.SidebarSectionHead);
  miscTitle.style.width = '100%';
  miscTitle.classList.add(tag);
  inventory.appendChild(miscTitle);
  let areMisc = false; // Keep track if there are any elements in that category
  for (const material of materials) {
    // For each material in the inventory...
    const tickerElem = _$(PrunCss.ColoredIcon.label, material);
    if (!tickerElem) {
      continue;
    }
    const ticker = tickerElem.textContent;
    if (ticker && !sorted.includes(ticker)) {
      // If the ticker hasn't been sorted, put it in other
      inventory.appendChild(material); // Add it to the bottom of the inventory
      areMisc = true;
    }
  }
  if (!areMisc) {
    inventory.removeChild(miscTitle);
  } // If no misc materials exist, remove the header

  return;
}

function materialListContains(materials: HTMLElement[], ticker) {
  for (let i = 0; i < materials.length; i++) {
    const tickerElem = _$(PrunCss.ColoredIcon.label, materials[i]);
    if (!tickerElem) {
      continue;
    }
    if (ticker === tickerElem.textContent) {
      return true;
    }
  }
  return false;
}

/**
 *  Finds if a screen/inventory combination and settings mode is active
 *  sortSettings: The settings stored in local storage
 *  screenPlanet: The screen name concatentated with the encoded inventory name
 *  sortModeName: The name of the sorting mode
 **/
function findIfActive(sortSettings, screenPlanet, sortModeName) {
  let match = false;
  for (const settings of sortSettings) {
    // For each setting, try to find a match
    if (settings[0] === screenPlanet && settings[1] === sortModeName) {
      match = true;
    }
  }
  return match;
}

/**
 *  Creates a toggle button to add to the sorting options
 *  result: The stored settings for PMMGExtended
 *  sortOptions: The list of sortion option elements at the top of each inventory
 *  abbreviation: The abbreviation on the button
 *  selected: Whether the button is selected
 *  combinedName: The concatentated screen and encoded inventory name
 **/
function createToggle(result, sortOptions, abbreviation, selected, combinedName, inventory) {
  const customSortButton = document.createElement('div'); // Create the button and style it
  customSortButton.classList.add(PrunCss.InventorySortControls.criteria);
  customSortButton.classList.add('pb-toggle'); // Add a class signifying it is created by PMMGExtended, but not to clean up

  const toggleLabel = document.createElement('div'); // Create the inner text label
  toggleLabel.textContent = abbreviation;
  customSortButton.appendChild(toggleLabel);

  if (selected) {
    // If the button is selected
    for (const option of Array.from(sortOptions.children) as HTMLElement[]) {
      // For each sorting option, clear away the carrot or circle
      if (option.children[1]) {
        if (option.classList.contains('pb-toggle')) {
          option.removeChild(option.children[1]);
        } else {
          (option.children[1] as HTMLElement).style.display = 'none';
        }
      }
    }
    // Add the triangle next to the current option
    const toggleIndicator = document.createElement('div');
    toggleIndicator.innerHTML = SortingTriangleHTML;
    toggleIndicator.style.marginLeft = '2px';
    customSortButton.appendChild(toggleIndicator);
  }

  customSortButton.addEventListener('click', () => {
    // When clicked, clear away the carrot or circle from each option
    for (const option of Array.from(sortOptions.children) as HTMLElement[]) {
      if (option.children[1]) {
        if (option.classList.contains('pb-toggle')) {
          option.removeChild(option.children[1]);
        } else {
          (option.children[1] as HTMLElement).style.display = 'none';
        }
        if (inventory.firstChild) {
          inventory.insertBefore(inventory.firstChild, inventory.firstChild);
        }
      }
    }
    // Add the triangle next to the current option
    const toggleIndicator = document.createElement('div');
    toggleIndicator.innerHTML = SortingTriangleHTML;
    toggleIndicator.style.marginLeft = '2px';
    customSortButton.appendChild(toggleIndicator);

    // Save to settings
    let savedBefore = false;
    for (const sortingOptions of result['PMMGExtended']['selected_sorting']) {
      if (sortingOptions[0] === combinedName) {
        sortingOptions[1] = abbreviation;
        savedBefore = true;
      }
    }
    if (!savedBefore) {
      result['PMMGExtended']['selected_sorting'].push([combinedName, abbreviation]);
    }
    setSettings(result);
    return;
  });

  return customSortButton;
}

// Extracts the material tickers from a list of material payloads, such as in FIO burn or FIO inventory payloads
function extractMaterials(burn, typeValue) {
  const materials = [] as string[];
  for (const mat of Object.keys(burn)) {
    if (burn[mat]['Type'] === typeValue) {
      materials.push(mat);
    }
  }
  return materials;
}

// Sorts materials by element category then by ticker. Works with Array.sort
function materialDivSort(elementA: HTMLElement, elementB: HTMLElement) {
  const tickerA = _$(PrunCss.ColoredIcon.label, elementA)?.textContent;
  const tickerB = _$(PrunCss.ColoredIcon.label, elementB)?.textContent;
  // TODO
  return tickerA === tickerB ? 0 : 0;
}

export function init() {
  const result = getXitArgs().pmmgSettings;
  if (result['PMMGExtended']['inventory_sorting']) {
    result['PMMGExtended']['inventory_sorting'] = undefined;
  } // If the old inventory sorting options are present, delete them

  if (!result['PMMGExtended']['selected_sorting']) {
    result['PMMGExtended']['selected_sorting'] = [];
  } // Replace them with a new inventory sorting option variable
  if (!result['PMMGExtended']['sorting']) {
    result['PMMGExtended']['sorting'] = [];
  }
  buffers.observe('INV', onInvReady);
  buffers.observe('SHPI', onShpiReady);
}

void features.add({
  id: 'inventory-organizer',
  init,
});
