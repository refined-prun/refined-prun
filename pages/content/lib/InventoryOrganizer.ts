import { Module } from './ModuleRunner';
import {
  getBuffersFromList,
  parseInvName,
  parsePlanetName,
  findCorrespondingPlanet,
  targetedCleanup,
  setSettings,
  showBuffer,
  createMaterialElement,
  calculateBurn,
} from './util';
import { Selector } from './Selector';
import { Style } from './Style';
import { MaterialNames, SortingTriangleHTML } from './GameProperties';

/**
 * Sort inventory into custom categories
 */
export class InventoryOrganizer implements Module {
  private userInfo; // The burn from the user info storage
  private result; // The settings stored
  private tag = 'pb-inv-org'; // The tag used to identifiy elements that need to be updated
  constructor(userInfo, result) {
    this.userInfo = userInfo;
    this.result = result;
  }

  cleanup() {
    //genericCleanup(this.tag);	// Clean up all elements with the tag
    return;
  }

  run(allBuffers) {
    const buffers = getBuffersFromList('INV ', allBuffers); // Get all inventory buffers
    const result = this.result;
    if (!buffers || !result || !result['PMMGExtended']) {
      return;
    }
    if (this.result['PMMGExtended']['inventory_sorting']) {
      this.result['PMMGExtended']['inventory_sorting'] = undefined;
    } // If the old inventory sorting options are present, delete them

    if (!this.result['PMMGExtended']['selected_sorting']) {
      this.result['PMMGExtended']['selected_sorting'] = [];
    } // Replace them with a new inventory sorting option variable
    if (!this.result['PMMGExtended']['sorting']) {
      this.result['PMMGExtended']['sorting'] = [];
    } // Initialize sorting if it doesn't exist
    const screenNameElem = document.querySelector(Selector.ScreenName); // Get the screen name
    const screenName = screenNameElem ? screenNameElem.textContent : '';
    if (!screenName) {
      return;
    }

    const tag = this.tag;

    buffers.forEach(buffer => {
      // For each buffer...
      const sortOptions = buffer.querySelector(Selector.InventorySortOptions); // Get the sorting option list at the top of the buffer
      if (!sortOptions) {
        return;
      }
      const baseNameElem = buffer.querySelector(Selector.BufferHeader); // Get the encoded name of the inventory (element)
      if (!baseNameElem) {
        return;
      }
      const invName = parseInvName(baseNameElem.textContent); // Get the name out of the element
      if (!invName) {
        return;
      }

      const planetNameElem = buffer.querySelector(Selector.BufferLink); // Get the human-friendly name of the planet (element)
      const planetName = planetNameElem ? parsePlanetName(planetNameElem.textContent) : ''; // Get the text out of it

      let burn;
      if (
        this.userInfo['PMMG-User-Info'] &&
        findCorrespondingPlanet(planetName, this.userInfo['PMMG-User-Info']['workforce'])
      ) {
        const workforce = findCorrespondingPlanet(planetName, this.userInfo['PMMG-User-Info']['workforce']);
        const production = findCorrespondingPlanet(planetName, this.userInfo['PMMG-User-Info']['production']);
        const inventory = findCorrespondingPlanet(planetName, this.userInfo['PMMG-User-Info']['storage']);

        burn = calculateBurn(production, workforce, inventory);
      }
      const inventory = buffer.querySelector(Selector.Inventory); // The inventory element containing all the materials
      if (!inventory || !inventory.parentElement) {
        return;
      }

      if (!inventory.classList.contains('pb-monitored')) {
        inventory.classList.add('pb-monitored');
        sortInventory(inventory, sortOptions, result, this.tag, screenName, invName, burn); // Now apply sorting and sorting select options

        const onMutationsObserved = function () {
          observer.disconnect();
          setTimeout(() => {
            observer.observe(target, config);
          }, 250); // Just chill...
          targetedCleanup(tag, inventory); // Cleanup old sorting stuff
          sortInventory(inventory, sortOptions, result, tag, screenName, invName, burn); // Now apply sorting and sorting select options
          return;
        };

        const target = inventory;
        const config = { childList: true, subtree: true };
        const MutationObserver = window['MutationObserver'] || window['WebKitMutationObserver'];
        const observer = new MutationObserver(onMutationsObserved);
        observer.observe(target, config);
      }

      return;
    });

    const shipBuffers = getBuffersFromList('SHPI ', allBuffers); // Get all ship inventory buffers
    if (!shipBuffers) {
      return;
    }
    shipBuffers.forEach(buffer => {
      const sortOptions = buffer.querySelector(Selector.InventorySortOptions); // Get the sorting option list at the top of the buffer
      if (!sortOptions) {
        return;
      }
      const shipNameElem = buffer.querySelector(Selector.BufferHeader); // Get the transponder of the ship (element)
      if (!shipNameElem) {
        return;
      }
      const shipName = parseInvName(shipNameElem.textContent); // Get the text from that element
      if (!shipName) {
        return;
      }

      const inventory = buffer.querySelector(Selector.Inventory); // The inventory element containing all the materials
      if (!inventory || !inventory.parentElement) {
        return;
      }

      if (!inventory.classList.contains('pb-monitored')) {
        inventory.classList.add('pb-monitored');
        sortInventory(inventory, sortOptions, result, tag, screenName, shipName, undefined); // Now apply sorting and sorting select options

        const onMutationsObserved = function () {
          observer.disconnect();
          setTimeout(() => {
            observer.observe(target, config);
          }, 250); // Just chill...
          targetedCleanup(tag, inventory); // Cleanup old sorting stuff
          sortInventory(inventory, sortOptions, result, tag, screenName, shipName, undefined); // Now apply sorting and sorting select options
          return;
        };

        const target = inventory;
        const config = { childList: true, subtree: true };
        const MutationObserver = window['MutationObserver'] || window['WebKitMutationObserver'];
        const observer = new MutationObserver(onMutationsObserved);
        observer.observe(target, config);
      }
      return;
    });
  }
}

/**
 *  Apply sorting and sorting select options
 *  inventory: Inventory element containing materials
 *  sortOptions: The list of sorting option elements
 *  result: The saved settings for PMMGExtended
 *  tag: The tag for this class
 *  screenName: The name of the screen
 *  planetName: The encoded name of the inventory
 *  burn: The burn for the planet (or undefined if it does not exist)
 **/
function sortInventory(inventory, sortOptions, result, tag, screenName, planetName, burn) {
  if (sortOptions.children.length <= 7) {
    // The length will be <=7 if no additional sorting options have been added
    // So act and create necessary elements
    (Array.from(sortOptions.children) as HTMLElement[]).forEach(option => {
      // For each of the stock options...
      if (option != sortOptions.firstChild && !option.classList.contains('pb-toggle')) {
        // Except the first one, excluding any ones created
        option.addEventListener('click', function () {
          // Add a function on click to disable custom sort and revert to stock sort
          if (option.children[1]) {
            // Reveal the arrow if it was hidden
            (option.children[1] as HTMLElement).style.display = 'inline';
          }
          (Array.from(sortOptions.children) as HTMLElement[]).forEach(optionInner => {
            // Look through each sortion option
            if (optionInner.children[1] && optionInner.classList.contains('pb-toggle')) {
              // Find ones that are selected and are custom sort options
              optionInner.removeChild(optionInner.children[1]); // Remove the dot
              result['PMMGExtended']['selected_sorting'].forEach(sortSettings => {
                // Find the corresponding entry in the settings and set that to nothing
                if (sortSettings[0] == screenName + planetName) {
                  sortSettings[1] = '';
                  setSettings(result);
                }
                return;
              });
            }
            return;
          });

          if (inventory.firstChild) {
            inventory.insertBefore(inventory.firstChild, inventory.firstChild);
          }
          return;
        });
      }
      return; // That's too many returns...
    });
    if (burn) {
      // If there is burn data for this inventory, add the burn sorting option
      sortOptions.appendChild(
        createToggle(
          result,
          sortOptions,
          'BRN',
          findIfActive(result['PMMGExtended']['selected_sorting'], screenName + planetName, 'BRN'),
          screenName + planetName,
          inventory,
        ),
      );
    }
    result['PMMGExtended']['sorting'].forEach(settings => {
      // For each setting for this inventory, create a button
      if (!settings[0] || !settings[1] || !settings[2]) {
        return;
      }
      if (settings[1].toUpperCase() != planetName.toUpperCase()) {
        return;
      }
      sortOptions.appendChild(
        createToggle(
          result,
          sortOptions,
          settings[0],
          findIfActive(result['PMMGExtended']['selected_sorting'], screenName + planetName, settings[0]),
          screenName + planetName,
          inventory,
        ),
      );
      return;
    });
  }

  if (
    sortOptions.children[sortOptions.children.length - 1] &&
    (sortOptions.children[sortOptions.children.length - 1] as HTMLElement).textContent != '+'
  ) {
    // Create the plus button to open the sorting option editing inventory
    const addButton = document.createElement('div');
    addButton.classList.add('InventorySortControls__criteria___ijLMgjm');
    sortOptions.appendChild(addButton);
    const addLabel = document.createElement('div');
    addLabel.textContent = '+';
    addButton.appendChild(addLabel);
    addButton.addEventListener('click', function () {
      showBuffer('XIT SORT_' + planetName);
      return;
    });
  }
  // End of stuff that only runs once on buffer creation

  // Move onto sorting the materials, this will run every iteration
  let activeSort = ''; // Which sorting option is active
  result['PMMGExtended']['selected_sorting'].forEach(sortSettings => {
    // Iterate through settings until the screen and inventory name combination is found
    if (sortSettings[0] == screenName + planetName) {
      activeSort = sortSettings[1];
    }
    return;
  });

  // Update circles live
  (Array.from(sortOptions.children) as HTMLElement[]).forEach(option => {
    // For each sorting option
    if (
      option != sortOptions.firstChild &&
      option.firstChild &&
      option.firstChild.textContent == activeSort &&
      !option.children[1]
    ) {
      // Test if it is the button corresponding to the active sort
      // Add the triangle next to it
      const toggleIndicator = document.createElement('div');
      toggleIndicator.innerHTML = SortingTriangleHTML;
      toggleIndicator.style.marginLeft = '2px';
      option.appendChild(toggleIndicator);
    } else if (option.firstChild && option.firstChild.textContent != activeSort && option.children[1]) {
      // If the button does not correspond to the active sort, remove the arrow or circle
      if (option.classList.contains('pb-toggle')) {
        option.removeChild(option.children[1]); // Remove the circle
      } else if (activeSort != '') {
        (option.children[1] as HTMLElement).style.display = 'none'; // Hide the arrow if custom sort is active
      } else {
        (option.children[1] as HTMLElement).style.display = 'inline'; // Show the arrow if custom sort is inactive
      }
    }
    return;
  });

  if (activeSort == '') {
    return;
  } // No sorting to do, stock option selected

  const materials = Array.from(inventory.querySelectorAll(Selector.FullMaterialIcon)) as HTMLElement[]; // Get all the material elements
  materials.sort(materialSort); // Sort the material elements by category primarily, then by ticker secondarily

  let sorted = [] as string[]; // A list of all the material tickers already sorted into categories
  let sortingDetails = []; // The details of which materials to put in which category [[catName, [MAT1, MAT2]], [catName2, [MAT3, MAT4]]]
  result['PMMGExtended']['sorting'].forEach(result_sortingDetails => {
    // Search through each option in the settings
    if (result_sortingDetails[0] == activeSort && result_sortingDetails[1] == planetName) {
      // If it matches, assign it to sortingDetails
      sortingDetails = result_sortingDetails;
    }
    return;
  });

  if (activeSort != 'BRN') {
    if (sortingDetails.length < 3) {
      return;
    } // No sorting to do

    if (sortingDetails[4]) {
      let materialsToSort = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sortingDetails[2] as any[]).forEach(category => {
        materialsToSort = materialsToSort.concat(category[1]);
      });
      materialsToSort = materialsToSort.filter((c, index) => {
        return materialsToSort.indexOf(c) === index;
      });

      materialsToSort.forEach(ticker => {
        if (!materialListContains(materials, ticker)) {
          const matElement = createMaterialElement(ticker, tag, '0', true, false);
          if (!matElement) {
            return;
          }
          const matQuantityElem = matElement.querySelector(Selector.MaterialQuantity) as HTMLElement;
          if (matQuantityElem) {
            matQuantityElem.style.color = '#cc0000';
          }
          materials.push(matElement);
        }
      });
      materials.sort(materialSort);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (sortingDetails[2] as any[]).forEach(category => {
      // For each sorting category...
      // Add a header
      const categoryTitle = document.createElement('h3');
      categoryTitle.appendChild(document.createTextNode(category[0]));
      categoryTitle.classList.add(...Style.SidebarSectionHead);
      categoryTitle.style.width = '100%';
      categoryTitle.classList.add(tag);
      inventory.appendChild(categoryTitle);
      let areItemsInCategory = false; // Keep track if there are any elements in that category
      materials.forEach(material => {
        // For each material in the inventory...
        const tickerElem = material.querySelector(Selector.MaterialText);
        if (!tickerElem) {
          return;
        }
        const ticker = tickerElem.textContent;
        if (ticker && category[1].includes(ticker) && !sorted.includes(ticker)) {
          // If the ticker is in that category and hasn't been sorted already
          inventory.appendChild(material); // Add it to the bottom of the inventory
          areItemsInCategory = true;
        }
      });
      if (!areItemsInCategory) {
        inventory.removeChild(categoryTitle);
      } // If there are no items in that category, return
      sorted = sorted.concat(category[1]); // Add the list of materials just sorted to the list of materials that have been sorted
      return;
    });
  }

  if (sortingDetails[3] || activeSort == 'BRN') {
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
      materials.forEach(material => {
        // For each material in the inventory...
        const tickerElem = material.querySelector(Selector.MaterialText);
        if (!tickerElem) {
          return;
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
      });
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
      materials.forEach(material => {
        // For each material in the inventory...
        const tickerElem = material.querySelector(Selector.MaterialText);
        if (!tickerElem) {
          return;
        }
        const ticker = tickerElem.textContent;
        if (ticker && inputMaterials.includes(ticker) && !sorted.includes(ticker)) {
          // Test if the ticker is an input
          inventory.appendChild(material); // Move it to the end of the list
          areInputs = true;
        }
      });
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
      materials.forEach(material => {
        // For each material in the inventory...
        const tickerElem = material.querySelector(Selector.MaterialText);
        if (!tickerElem) {
          return;
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
      });
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
  materials.forEach(material => {
    // For each material in the inventory...
    const tickerElem = material.querySelector(Selector.MaterialText);
    if (!tickerElem) {
      return;
    }
    const ticker = tickerElem.textContent;
    if (ticker && !sorted.includes(ticker)) {
      // If the ticker hasn't been sorted, put it in other
      inventory.appendChild(material); // Add it to the bottom of the inventory
      areMisc = true;
    }
    return;
  });
  if (!areMisc) {
    inventory.removeChild(miscTitle);
  } // If no misc materials exist, remove the header

  return;
}

function materialListContains(materials, ticker) {
  for (let i = 0; i < materials.length; i++) {
    const tickerElem = materials[i].querySelector(Selector.MaterialText);
    if (!tickerElem) {
      continue;
    }
    if (ticker == tickerElem.textContent) {
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
  sortSettings.forEach(settings => {
    // For each setting, try to find a match
    if (settings[0] == screenPlanet && settings[1] == sortModeName) {
      match = true;
    }
    return match;
  });
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
  customSortButton.classList.add('InventorySortControls__criteria___ijLMgjm');
  customSortButton.classList.add('pb-toggle'); // Add a class signifying it is created by PMMGExtended, but not to clean up

  const toggleLabel = document.createElement('div'); // Create the inner text label
  toggleLabel.textContent = abbreviation;
  customSortButton.appendChild(toggleLabel);

  if (selected) {
    // If the button is selected
    (Array.from(sortOptions.children) as HTMLElement[]).forEach(option => {
      // For each sorting option, clear away the carrot or circle
      if (option.children[1]) {
        if (option.classList.contains('pb-toggle')) {
          option.removeChild(option.children[1]);
        } else {
          (option.children[1] as HTMLElement).style.display = 'none';
        }
      }
      return;
    });
    // Add the triangle next to the current option
    const toggleIndicator = document.createElement('div');
    toggleIndicator.innerHTML = SortingTriangleHTML;
    toggleIndicator.style.marginLeft = '2px';
    customSortButton.appendChild(toggleIndicator);
  }

  customSortButton.addEventListener('click', function () {
    // When clicked, clear away the carrot or circle from each option
    (Array.from(sortOptions.children) as HTMLElement[]).forEach(option => {
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
      return;
    });
    // Add the triangle next to the current option
    const toggleIndicator = document.createElement('div');
    toggleIndicator.innerHTML = SortingTriangleHTML;
    toggleIndicator.style.marginLeft = '2px';
    customSortButton.appendChild(toggleIndicator);

    // Save to settings
    let savedBefore = false;
    result['PMMGExtended']['selected_sorting'].forEach(sortingOptions => {
      if (sortingOptions[0] == combinedName) {
        sortingOptions[1] = abbreviation;
        savedBefore = true;
      }
      return;
    });
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
  Object.keys(burn).forEach(mat => {
    if (burn[mat]['Type'] == typeValue) {
      materials.push(mat);
    }
  });
  return materials;
}

// Sorts materials by element category then by ticker. Works with Array.sort
function materialSort(a, b) {
  const tickerElemA = a.querySelector(Selector.MaterialText);
  if (!tickerElemA) {
    return;
  }
  const tickerA = tickerElemA.textContent;

  const tickerElemB = b.querySelector(Selector.MaterialText);
  if (!tickerElemB) {
    return;
  }
  const tickerB = tickerElemB.textContent;

  if (!MaterialNames[tickerA] || !MaterialNames[tickerB]) {
    return 0;
  }

  if (MaterialNames[tickerA][1] == MaterialNames[tickerB][1]) {
    return tickerA.localeCompare(tickerB);
  }

  return MaterialNames[tickerA][1].localeCompare(MaterialNames[tickerB][1]);
}
