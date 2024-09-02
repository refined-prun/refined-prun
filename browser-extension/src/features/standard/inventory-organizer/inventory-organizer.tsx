import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { BurnValues, calculatePlanetBurn } from '@src/core/burn';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import buffers from '@src/infrastructure/prun-ui/prun-buffers';
import features from '@src/feature-registry';
import descendantPresent from '@src/utils/descendant-present';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { _$, _$$ } from '@src/utils/get-element-by-class-name';
import { settings } from '@src/store/settings';
import { widgetAppend } from '@src/utils/vue-mount';
import CategoryHeader from '@src/features/standard/inventory-organizer/CategoryHeader.vue';
import InventorySortControls from '@src/features/standard/inventory-organizer/InventorySortControls.vue';
import { materialsStore, sortMaterialsBy } from '@src/infrastructure/prun-api/data/materials';
import { App } from 'vue';
import GridMaterialIcon from '@src/components/GridMaterialIcon.vue';
import { currentScreen } from '@src/infrastructure/prun-api/data/ui-data';

async function onInvReady(buffer: PrunBuffer) {
  await observeInventoryChanged(buffer);
}

async function onShpiReady(buffer: PrunBuffer) {
  await observeInventoryChanged(buffer);
}

async function observeInventoryChanged(buffer: PrunBuffer) {
  const inventoryId = buffer.parameter;
  if (!inventoryId) {
    return;
  }
  const storage = storagesStore.getByShortId(inventoryId);
  const site = sitesStore.getById(storage?.addressableId);
  const workforce = workforcesStore.getById(site?.siteId)?.workforces;
  let burn: BurnValues | undefined = undefined;
  if (workforce) {
    const production = productionStore.getBySiteId(site?.siteId);
    const stores = storagesStore.getByAddress(site?.siteId);
    burn = calculatePlanetBurn(production, workforce, stores);
  }

  const screenName = getScreenName();
  const sortOptions = await descendantPresent(buffer.frame, PrunCss.InventorySortControls.controls);
  const inventory = await descendantPresent(buffer.frame, PrunCss.InventoryView.grid);
  const cleanup = [];
  appendSortControls(sortOptions, screenName, inventoryId, inventory, burn);
  sortInventory(inventory, sortOptions, screenName, inventoryId, burn, cleanup);
  const observer = new MutationObserver(() => {
    observer.disconnect();
    sortInventory(inventory, sortOptions, screenName, inventoryId, burn, cleanup);
    setTimeout(() => observer.observe(inventory, { childList: true, subtree: true }), 0);
  });
  observer.observe(inventory, { childList: true, subtree: true });
}

function getScreenName() {
  return currentScreen.value?.name ?? '';
}

function appendSortControls(
  sortOptions: HTMLElement,
  screenName: string,
  invName: string,
  inventory: HTMLElement,
  burn: BurnValues | undefined,
) {
  const id = screenName + invName;
  for (const option of Array.from(sortOptions.children) as HTMLElement[]) {
    if (option === sortOptions.firstChild || option.classList.contains('pb-toggle')) {
      continue;
    }
    option.addEventListener('click', () => {
      // Add a function on click to disable custom sort and revert to stock sort
      if (option.children[1]) {
        // Reveal the arrow if it was hidden
        (option.children[1] as HTMLElement).style.display = 'inline';
      }
      for (const optionInner of Array.from(sortOptions.children)) {
        // Look through each sortion option
        if (optionInner.children[1] && optionInner.classList.contains('pb-toggle')) {
          // Find ones that are selected and are custom sort options
          optionInner.removeChild(optionInner.children[1]); // Remove the dot
          for (const sortSettings of settings.selectedSorting) {
            // Find the corresponding entry in the settings and set that to nothing
            if (sortSettings[0] === id) {
              sortSettings[1] = '';
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
  if (burn) {
    sortOptions.appendChild(
      createToggle(
        sortOptions,
        'BRN',
        findIfActive(settings.selectedSorting, id, 'BRN'),
        id,
        inventory,
      ),
    );
  }
  for (const setting of settings.sorting) {
    // For each setting for this inventory, create a button
    if (!setting[0] || !setting[1] || !setting[2]) {
      continue;
    }
    if (setting[1].toUpperCase() !== invName.toUpperCase()) {
      continue;
    }
    sortOptions.appendChild(
      createToggle(
        sortOptions,
        setting[0],
        findIfActive(settings.selectedSorting, id, setting[0]),
        id,
        inventory,
      ),
    );
  }
  widgetAppend(sortOptions, InventorySortControls, { storeId: invName });
}

function sortInventory(
  inventory: HTMLElement,
  sortOptions: HTMLElement,
  screenName: string,
  invName: string,
  burn: BurnValues | undefined,
  cleanupList: App<Element>[],
) {
  for (const widget of cleanupList) {
    widget.unmount();
  }
  cleanupList.length = 0;
  const activeSort = settings.selectedSorting.find(x => x[0] === screenName + invName)?.[1] ?? '';
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

  let gridItems = getGridItems(inventory);
  gridItems = sortMaterialsBy(gridItems, x => x.material);

  let sorted: string[] = []; // A list of all the material tickers already sorted into categories
  const sortingDetails = settings.sorting.find(x => x[0] === activeSort && x[1] === invName) ?? [];

  if (activeSort !== 'BRN') {
    if (sortingDetails.length < 3) {
      return;
    } // No sorting to do

    if (sortingDetails[4]) {
      let materialsToSort: string[] = [];
      for (const category of sortingDetails[2]!) {
        materialsToSort = materialsToSort.concat(category[1]);
      }
      materialsToSort = materialsToSort.filter((c, index) => {
        return materialsToSort.indexOf(c) === index;
      });

      for (const ticker of materialsToSort) {
        if (gridItems.every(x => x.material?.ticker !== ticker)) {
          const material = materialsStore.getByTicker(ticker);
          if (!material) {
            continue;
          }
          const { widget, instance } = widgetAppend(inventory, GridMaterialIcon, {
            ticker,
            amount: 0,
            warning: true,
          });
          cleanupList.push(widget);
          gridItems.push({ div: instance.$el, material });
        }
      }
      sortMaterialsBy(gridItems, x => x.material);
    }

    for (const category of sortingDetails[2]!) {
      let categoryTitleAdded = false;
      for (const gridItem of gridItems) {
        const ticker = gridItem.material?.ticker;
        if (!ticker || !category[1].includes(ticker) || sorted.includes(ticker)) {
          continue;
        }
        if (!categoryTitleAdded) {
          const { widget } = widgetAppend(inventory, CategoryHeader, { label: category[0] });
          cleanupList.push(widget);
          categoryTitleAdded = true;
        }
        inventory.appendChild(gridItem.div);
      }
      sorted = sorted.concat(category[1]);
    }
  }

  if ((sortingDetails[3] || activeSort === 'BRN') && burn) {
    const workforceMaterials = Object.keys(burn).filter(x => burn[x].Type === 'workforce');
    const inputMaterials = Object.keys(burn).filter(x => burn[x].Type === 'input');
    const outputMaterials = Object.keys(burn).filter(x => burn[x].Type === 'output');

    let workforceTitleAdded = false;
    for (const gridItem of gridItems) {
      const ticker = gridItem.material?.ticker;
      const isConsumable =
        ticker &&
        workforceMaterials.includes(ticker) &&
        !inputMaterials.includes(ticker) &&
        !outputMaterials.includes(ticker) &&
        !sorted.includes(ticker);
      if (!isConsumable) {
        continue;
      }
      if (!workforceTitleAdded) {
        const { widget } = widgetAppend(inventory, CategoryHeader, { label: 'Consumables' });
        cleanupList.push(widget);
        workforceTitleAdded = true;
      }
      inventory.appendChild(gridItem.div);
    }

    let inputTitleAdded = false;
    for (const gridItem of gridItems) {
      const ticker = gridItem.material?.ticker;
      if (!ticker || !inputMaterials.includes(ticker) || sorted.includes(ticker)) {
        continue;
      }
      if (!inputTitleAdded) {
        const { widget } = widgetAppend(inventory, CategoryHeader, { label: 'Inputs' });
        cleanupList.push(widget);
        inputTitleAdded = true;
      }
      inventory.appendChild(gridItem.div);
    }

    let outputTitleAdded = false;
    for (const gridItem of gridItems) {
      const ticker = gridItem.material?.ticker;
      const isOutput =
        ticker &&
        outputMaterials.includes(ticker) &&
        !inputMaterials.includes(ticker) &&
        !sorted.includes(ticker);
      if (!isOutput) {
        continue;
      }
      if (!outputTitleAdded) {
        const { widget } = widgetAppend(inventory, CategoryHeader, { label: 'Outputs' });
        cleanupList.push(widget);
        outputTitleAdded = true;
      }
      inventory.appendChild(gridItem.div);
    }
    sorted = sorted.concat(workforceMaterials);
    sorted = sorted.concat(inputMaterials);
    sorted = sorted.concat(outputMaterials);
  }
  let miscTitleAdded = false;
  for (const gridItem of gridItems) {
    const ticker = gridItem.material?.ticker;
    if (ticker && sorted.includes(ticker)) {
      continue;
    }
    if (!miscTitleAdded) {
      const { widget } = widgetAppend(inventory, CategoryHeader, { label: 'Other' });
      cleanupList.push(widget);
      miscTitleAdded = true;
    }
    inventory.appendChild(gridItem.div);
  }
}

function getGridItems(inventory: HTMLElement) {
  const materialDivs = _$$(PrunCss.GridItemView.container, inventory);
  const result: { div: HTMLElement; material: PrunApi.Material | undefined }[] = [];
  for (const div of materialDivs) {
    const ticker = _$(PrunCss.ColoredIcon.label, div)?.textContent;
    const material = materialsStore.getByTicker(ticker);
    result.push({ div, material });
  }
  return result;
}

/**
 *  Finds if a screen/inventory combination and settings mode is active
 *  sortSettings: The settings stored in local storage
 *  screenPlanet: The screen name concatentated with the encoded inventory name
 *  sortModeName: The name of the sorting mode
 **/
function findIfActive(
  sortSettings: [string, string][],
  screenPlanet: string,
  sortModeName: string,
) {
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
 *  sortOptions: The list of sortion option elements at the top of each inventory
 *  abbreviation: The abbreviation on the button
 *  selected: Whether the button is selected
 *  combinedName: The concatentated screen and encoded inventory name
 **/
function createToggle(
  sortOptions: HTMLElement,
  abbreviation: string,
  selected: boolean,
  combinedName: string,
  inventory: HTMLElement,
) {
  const customSortButton = document.createElement('div'); // Create the button and style it
  customSortButton.classList.add(PrunCss.InventorySortControls.criteria);
  customSortButton.classList.add('pb-toggle'); // Add a class signifying it is created by PMMGExtended, but not to clean up

  const toggleLabel = document.createElement('div'); // Create the inner text label
  toggleLabel.textContent = abbreviation;
  customSortButton.appendChild(toggleLabel);

  if (selected) {
    // If the button is selected
    for (const option of Array.from(sortOptions.children)) {
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
    for (const option of Array.from(sortOptions.children)) {
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
    for (const sortingOptions of settings.selectedSorting) {
      if (sortingOptions[0] === combinedName) {
        sortingOptions[1] = abbreviation;
        savedBefore = true;
      }
    }
    if (!savedBefore) {
      settings.selectedSorting.push([combinedName, abbreviation]);
    }
    return;
  });

  return customSortButton;
}

const SortingTriangleHTML = `
<div title="">
  <svg aria-hidden="true" width="10" height="10" role="img" version="1.1" fill="currentcolor" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" style="vertical-align: middle;"><g><path d="M.88681 1.097752l12.13774 21.02318L25.422964 1.105446z"></path></g>
  </svg>
</div>`;

export function init() {
  buffers.observe('INV', onInvReady);
  buffers.observe('SHPI', onShpiReady);
}

void features.add({
  id: 'inventory-organizer',
  init,
});
