import classes from './inv-custom-sorting.module.css';
import { BurnValues, getPlanetBurn } from '@src/core/burn';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import descendantPresent from '@src/utils/descendant-present';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { _$, _$$ } from '@src/utils/get-element-by-class-name';
import { settings, SortingMode } from '@src/store/settings';
import CategoryHeader from './CategoryHeader.vue';
import InventorySortControls from './InventorySortControls.vue';
import {
  materialsStore,
  sortMaterials,
  sortMaterialsBy,
} from '@src/infrastructure/prun-api/data/materials';
import { App, computed, reactive, watch } from 'vue';
import GridMaterialIcon from '@src/components/GridMaterialIcon.vue';
import { tilesStore } from '@src/infrastructure/prun-api/data/tiles';
import xit from '@src/features/XIT/xit-registry.js';
import SORT from '@src/features/XIT/SORT/SORT.vue';
import onElementDisconnected from '@src/utils/on-element-disconnected';
import { TileState } from '@src/features/standard/inv-custom-sorting/tile-state';
import { showBuffer } from '@src/util';
import { fragmentAppAppend } from '@src/utils/vue-fragment-app';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

async function onInvReady(tile: PrunTile) {
  await mountCustomSorting(tile);
}

async function onShpiReady(tile: PrunTile) {
  await mountCustomSorting(tile);
}

async function mountCustomSorting(tile: PrunTile) {
  const storeId = tile.parameter;
  if (!storeId) {
    return;
  }

  const tileState = computed(() => tilesStore.getTileState(tile) as TileState);
  const sortOptions = await descendantPresent(tile.frame, PrunCss.InventorySortControls.controls);
  const inventory = await descendantPresent(tile.frame, PrunCss.InventoryView.grid);

  // Skip the first sorting option because it is the grid/list view switch.
  for (let i = 1; i < sortOptions.children.length; i++) {
    const option = sortOptions.children.item(i) as HTMLElement;
    option.addEventListener('click', () => delete tileState.value.activeSort);
  }

  const burn = computed(() => getPlanetBurn(storagesStore.getByShortId(storeId)?.addressableId));

  const sortingModes = computed(() => {
    const modes = settings.sorting.filter(x => x.storeId === storeId);
    if (burn.value) {
      modes.push(createBurnSortingMode(storeId));
    }
    return modes;
  });

  const activeSort = computed(() => tileState.value.activeSort);
  const activeSortingMode = computed(() =>
    sortingModes.value.find(x => x.label === tileState.value.activeSort),
  );

  watch(
    activeSortingMode,
    mode => {
      if (mode) {
        sortOptions.classList.add(classes.custom);
      } else {
        sortOptions.classList.remove(classes.custom);
      }
    },
    { immediate: true },
  );

  fragmentAppAppend(
    sortOptions,
    InventorySortControls,
    reactive({
      sortingModes,
      activeSort,
      onModeClick: (mode: string) => (tileState.value.activeSort = mode),
      onAddClick: () => showBuffer(`XIT SORT ${storeId}`),
    }),
  );

  const cleanup = [];
  const runSort = () => {
    observer.disconnect();
    sortInventory(inventory, activeSortingMode.value, burn.value?.burn, cleanup);
    setTimeout(() => observer.observe(inventory, { childList: true, subtree: true }), 0);
  };
  const observer = new MutationObserver(runSort);
  onElementDisconnected(inventory, watch([reactive({ activeSortingMode }), burn], runSort));
  runSort();
}

function sortInventory(
  inventory: Element,
  sortingMode: SortingMode | undefined,
  burn: BurnValues | undefined,
  cleanup: App[],
) {
  for (const widget of cleanup) {
    widget.unmount();
  }
  cleanup.length = 0;
  if (!sortingMode) {
    return;
  }

  const gridItems = _$$(PrunCss.GridItemView.container, inventory).map(div => ({
    div,
    ticker: _$(PrunCss.ColoredIcon.label, div)?.textContent,
  }));
  const categories = sortingMode.categories.slice();

  if (sortingMode.burn && burn) {
    const tickers = Object.keys(burn);
    const inputs = new Set(tickers.filter(x => burn[x].Type === 'input'));
    const outputs = new Set(tickers.filter(x => burn[x].Type === 'output' && !inputs.has(x)));
    const workforce = tickers.filter(
      x => burn[x].Type === 'workforce' && !inputs.has(x) && !outputs.has(x),
    );

    categories.push({
      name: 'Consumables',
      materials: workforce,
    });
    categories.push({
      name: 'Inputs',
      materials: [...inputs],
    });
    categories.push({
      name: 'Outputs',
      materials: [...outputs],
    });
  }

  const addedItems = new Set<string>();
  const remainingItems = new Set(gridItems);

  for (const category of categories) {
    let materials = category.materials
      .filter(x => !addedItems.has(x))
      .map(x => materialsStore.getByTicker(x)!)
      .filter(x => x!);
    if (materials.length === 0) {
      continue;
    }

    cleanup.push(fragmentAppAppend(inventory, CategoryHeader, { label: category.name }));
    materials = sortMaterials(materials);
    for (const material of materials) {
      const gridItem = gridItems.find(x => x.ticker === material.ticker);
      if (gridItem) {
        inventory.appendChild(gridItem.div);
        remainingItems.delete(gridItem);
      } else if (sortingMode.zero) {
        cleanup.push(
          fragmentAppAppend(inventory, GridMaterialIcon, {
            ticker: material.ticker,
            amount: 0,
            warning: true,
          }),
        );
      }
      addedItems.add(material.ticker);
    }
  }

  if (remainingItems.size === 0) {
    return;
  }

  cleanup.push(fragmentAppAppend(inventory, CategoryHeader, { label: 'Other' }));
  let otherItems = [...remainingItems].map(x => ({
    div: x.div,
    material: materialsStore.getByTicker(x.ticker),
  }));
  otherItems = sortMaterialsBy(otherItems, x => x.material);
  for (const item of otherItems) {
    inventory.appendChild(item.div);
  }
}

function createBurnSortingMode(storeId: string): SortingMode {
  return {
    label: 'BRN',
    storeId,
    categories: [],
    burn: true,
    zero: true,
  };
}

export function init() {
  applyCssRule(`.${classes.custom} .${PrunCss.InventorySortControls.order} > div`, classes.hide);

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
