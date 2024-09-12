import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { BurnValues, calculatePlanetBurn } from '@src/core/burn';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import descendantPresent from '@src/utils/descendant-present';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { _$, _$$ } from '@src/utils/get-element-by-class-name';
import { settings } from '@src/store/settings';
import { widgetAppend } from '@src/utils/vue-mount';
import CategoryHeader from './CategoryHeader.vue';
import InventorySortControls from './InventorySortControls.vue';
import { materialsStore, sortMaterialsBy } from '@src/infrastructure/prun-api/data/materials';
import { App } from 'vue';
import GridMaterialIcon from '@src/components/GridMaterialIcon.vue';
import { tilesStore } from '@src/infrastructure/prun-api/data/tiles';
import xit from '@src/features/XIT/xit-registry.js';
import SORT from '@src/features/XIT/SORT/SORT.vue';

interface TileState {
  activeSort?: string;
}

async function onInvReady(tile: PrunTile) {
  await observeInventoryChanged(tile);
}

async function onShpiReady(tile: PrunTile) {
  await observeInventoryChanged(tile);
}

async function observeInventoryChanged(tile: PrunTile) {
  const inventoryId = tile.parameter;
  if (!inventoryId) {
    return;
  }
  const tileState = tilesStore.getTileState(tile);
  const storage = storagesStore.getByShortId(inventoryId);
  const site = sitesStore.getById(storage?.addressableId);
  const workforce = workforcesStore.getById(site?.siteId)?.workforces;
  let burn: BurnValues | undefined = undefined;
  if (workforce) {
    const production = productionStore.getBySiteId(site?.siteId);
    const stores = storagesStore.getByAddress(site?.siteId);
    burn = calculatePlanetBurn(production, workforce, stores);
  }

  const sortOptions = await descendantPresent(tile.frame, PrunCss.InventorySortControls.controls);
  const inventory = await descendantPresent(tile.frame, PrunCss.InventoryView.grid);
  const cleanup = [];
  appendSortControls(sortOptions, inventoryId, inventory, burn, tileState);
  sortInventory(inventory, sortOptions, inventoryId, burn, cleanup, tileState);
  const observer = new MutationObserver(() => {
    observer.disconnect();
    sortInventory(inventory, sortOptions, inventoryId, burn, cleanup, tileState);
    setTimeout(() => observer.observe(inventory, { childList: true, subtree: true }), 0);
  });
  observer.observe(inventory, { childList: true, subtree: true });
}

function appendSortControls(
  sortOptions: HTMLElement,
  invName: string,
  inventory: HTMLElement,
  burn: BurnValues | undefined,
  tileState: TileState,
) {
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
          delete tileState.activeSort;
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
      createToggle(sortOptions, 'BRN', tileState.activeSort === 'BRN', inventory, tileState),
    );
  }

  const sortingModes = settings.sorting.filter(
    x => x.storeId.toUpperCase() === invName.toUpperCase(),
  );
  for (const sortingMode of sortingModes) {
    sortOptions.appendChild(
      createToggle(
        sortOptions,
        sortingMode.label,
        tileState.activeSort === sortingMode.label,
        inventory,
        tileState,
      ),
    );
  }
  widgetAppend(sortOptions, InventorySortControls, { storeId: invName });
}

function sortInventory(
  inventory: HTMLElement,
  sortOptions: HTMLElement,
  invName: string,
  burn: BurnValues | undefined,
  cleanupList: App<Element>[],
  tileState: TileState,
) {
  for (const widget of cleanupList) {
    widget.unmount();
  }
  cleanupList.length = 0;
  const activeSort = tileState.activeSort ?? '';
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
  const sortingMode = settings.sorting.find(x => x.label === activeSort && x.storeId === invName);

  if (activeSort !== 'BRN') {
    if (!sortingMode) {
      return;
    }

    if (sortingMode.zero) {
      let materialsToSort: string[] = [];
      for (const category of sortingMode.categories) {
        materialsToSort = materialsToSort.concat(category.materials);
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

    for (const category of sortingMode.categories) {
      let categoryTitleAdded = false;
      for (const gridItem of gridItems) {
        const ticker = gridItem.material?.ticker;
        if (!ticker || !category.materials.includes(ticker) || sorted.includes(ticker)) {
          continue;
        }
        if (!categoryTitleAdded) {
          const { widget } = widgetAppend(inventory, CategoryHeader, { label: category.name });
          cleanupList.push(widget);
          categoryTitleAdded = true;
        }
        inventory.appendChild(gridItem.div);
      }
      sorted = sorted.concat(category.materials);
    }
  }

  if ((sortingMode?.burn || activeSort === 'BRN') && burn) {
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
  inventory: HTMLElement,
  tileState: TileState,
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
    tileState.activeSort = abbreviation;
  });

  return customSortButton;
}

const SortingTriangleHTML = `
<div title="">
  <svg aria-hidden="true" width="10" height="10" role="img" version="1.1" fill="currentcolor" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" style="vertical-align: middle;"><g><path d="M.88681 1.097752l12.13774 21.02318L25.422964 1.105446z"></path></g>
  </svg>
</div>`;

export function init() {
  tiles.observe('INV', onInvReady);
  tiles.observe('SHPI', onShpiReady);

  xit.add({
    command: 'SORT',
    name: 'SORTING MODES',
    component: () => SORT,
  });
}

void features.add({
  id: 'inv-custom-sorting',
  init,
});
