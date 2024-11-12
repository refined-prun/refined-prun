import css from '@src/utils/css-utils.module.css';
import classes from './inv-custom-sorting.module.css';
import { BurnValues, getPlanetBurn } from '@src/core/burn';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import CategoryHeader from './CategoryHeader.vue';
import InventorySortControls from './InventorySortControls.vue';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import GridMaterialIcon from '@src/components/GridMaterialIcon.vue';
import SORT from '@src/features/XIT/SORT/SORT.vue';
import { getTileState } from '@src/features/standard/inv-custom-sorting/tile-state';
import { createFragmentApp, FragmentAppScope } from '@src/utils/vue-fragment-app';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { userData } from '@src/store/user-data';
import { sortMaterials, sortMaterialsBy } from '@src/core/sort-materials';
import { computedTileState } from '@src/store/user-data-tiles';
import { watchEffectWhileNodeAlive } from '@src/utils/watch-effect-while-node-alive';
import { isDefined, isEmpty } from 'ts-extras';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.InventoryView.container), container =>
    applyCustomSorting(tile, container),
  );
}

async function applyCustomSorting(tile: PrunTile, container: HTMLElement) {
  const storeId = tile.parameter;
  if (!storeId) {
    return;
  }

  const activeSort = computedTileState(getTileState(tile), 'activeSort', undefined);
  const sortOptions = await $(container, C.InventorySortControls.controls);
  const inventory = await $(container, C.InventoryView.grid);

  // Skip the first sorting option because it is the grid/list view switch.
  for (let i = 1; i < sortOptions.children.length; i++) {
    const option = sortOptions.children.item(i) as HTMLElement;
    option.addEventListener('click', () => (activeSort.value = undefined));
  }

  const burn = computed(() => getPlanetBurn(storagesStore.getById(storeId)?.addressableId));

  const sorting = computed(() => {
    const modes = userData.sorting.filter(x => x.storeId === storeId);
    if (burn.value) {
      modes.push(createBurnSortingMode(storeId));
    }
    return modes;
  });

  const activeSorting = computed(() => sorting.value.find(x => x.label === activeSort.value));

  watchEffectWhileNodeAlive(sortOptions, () => {
    if (activeSorting.value) {
      sortOptions.classList.add(classes.custom);
    } else {
      sortOptions.classList.remove(classes.custom);
    }
  });

  createFragmentApp(
    InventorySortControls,
    reactive({
      sorting,
      activeSort,
      onModeClick: (mode: string) => (activeSort.value = mode),
      onAddClick: () => showBuffer(`XIT SORT ${storeId}`),
    }),
  ).appendTo(sortOptions);

  const scope = new FragmentAppScope();
  const runSort = () => {
    observer.disconnect();
    scope.begin();
    sortInventory(inventory, activeSorting.value, burn.value?.burn);
    scope.end();
    setTimeout(() => observer.observe(inventory, { childList: true, subtree: true }), 0);
  };
  const observer = new MutationObserver(runSort);
  watchEffectWhileNodeAlive(inventory, () => {
    // Touch reactive values.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = activeSorting.value && burn.value;
    runSort();
  });
  runSort();
}

function sortInventory(
  inventory: Element,
  sorting: UserData.SortingMode | undefined,
  burn: BurnValues | undefined,
) {
  if (!sorting) {
    return;
  }

  const gridItems = _$$(inventory, C.GridItemView.container).map(div => ({
    div,
    ticker: _$(div, C.ColoredIcon.label)?.textContent,
  }));
  const categories = sorting.categories.slice();

  if (sorting.burn && burn) {
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
      .map(x => materialsStore.getByTicker(x))
      .filter(isDefined);
    if (isEmpty(materials)) {
      continue;
    }

    createFragmentApp(CategoryHeader, { label: category.name }).appendTo(inventory);
    materials = sortMaterials(materials);
    for (const material of materials) {
      const gridItem = gridItems.find(x => x.ticker === material.ticker);
      if (gridItem) {
        inventory.appendChild(gridItem.div);
        remainingItems.delete(gridItem);
      } else if (sorting.zero) {
        createFragmentApp(GridMaterialIcon, {
          ticker: material.ticker,
          amount: 0,
          warning: true,
        }).appendTo(inventory);
      }
      addedItems.add(material.ticker);
    }
  }

  if (remainingItems.size === 0) {
    return;
  }

  createFragmentApp(CategoryHeader, { label: 'Other' }).appendTo(inventory);
  let otherItems = [...remainingItems].map(x => ({
    div: x.div,
    material: materialsStore.getByTicker(x.ticker),
  }));
  otherItems = sortMaterialsBy(otherItems, x => x.material);
  for (const item of otherItems) {
    inventory.appendChild(item.div);
  }
}

function createBurnSortingMode(storeId: string): UserData.SortingMode {
  return {
    label: 'BRN',
    storeId,
    categories: [],
    burn: true,
    zero: true,
  };
}

function init() {
  applyCssRule(`.${classes.custom} .${C.InventorySortControls.order} > div`, css.hidden);
  tiles.observe(['INV', 'SHPI'], onTileReady);
  xit.add({
    command: 'SORT',
    name: 'SORTING MODES',
    component: () => SORT,
  });
}

features.add(import.meta.url, init, 'INV: Adds custom sorting modes.');
