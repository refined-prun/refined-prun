import css from '@src/utils/css-utils.module.css';
import classes from './custom-item-sorting.module.css';
import { BurnValues, getPlanetBurn } from '@src/core/burn';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import CategoryHeader from './CategoryHeader.vue';
import InventorySortControls from './InventorySortControls.vue';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import GridMaterialIcon from '@src/components/GridMaterialIcon.vue';
import SORT from '@src/features/XIT/SORT/SORT.vue';
import { createFragmentApp, FragmentAppScope } from '@src/utils/vue-fragment-app';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { sortByMaterial, sortMaterials } from '@src/core/sort-materials';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import { isDefined, isEmpty } from 'ts-extras';
import SortCriteria from '@src/features/basic/custom-item-sorting/SortCriteria.vue';
import { getSortingData } from '@src/store/user-data-sorting';
import { getInvStore } from '@src/core/store-id';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.InventoryView.container), container =>
    applyCustomSorting(tile, container),
  );
}

async function applyCustomSorting(tile: PrunTile, container: HTMLElement) {
  const parameter = tile.parameter;
  if (!parameter) {
    return;
  }

  const store = getInvStore(parameter);
  const sortingData = getSortingData(parameter);
  const catSort = computed({
    get: () => sortingData.cat ?? true,
    set: value => (sortingData.cat = value ? undefined : false),
  });
  const reverseSort = computed({
    get: () => sortingData.reverse ?? false,
    set: value => (sortingData.reverse = value ? true : undefined),
  });
  const sortOptions = await $(container, C.InventorySortControls.controls);
  const inventory = await $(container, C.InventoryView.grid);

  // Enumerate children in advance because we will modify the collection in the loop.
  const criterion = Array.from(sortOptions.children);

  // Skip the first sorting option because it is the grid/list view switch.
  for (let i = 1; i < criterion.length; i++) {
    const option = criterion[i] as HTMLElement;
    option.addEventListener('click', () => {
      sortingData.active = undefined;
      catSort.value = false;
    });
    const isCategorySort = i === 2;
    if (!isCategorySort) {
      continue;
    }
    createFragmentApp(
      SortCriteria,
      reactive({
        label: option.textContent ?? 'CAT',
        active: catSort,
        reverse: reverseSort,
        onClick: () => {
          if (catSort.value) {
            reverseSort.value = !reverseSort.value;
          } else {
            sortingData.active = undefined;
            catSort.value = true;
            reverseSort.value = false;
          }
        },
      }),
    ).after(option);
    option.style.display = 'none';
  }

  const burn = computed(() => getPlanetBurn(storagesStore.getById(parameter)?.addressableId));

  const modes = computed(() => {
    const modes = sortingData.modes.slice();
    if (burn.value) {
      modes.push(burnSortingMode);
    }
    return modes;
  });

  watchEffectWhileNodeAlive(sortOptions, () => {
    if (sortingData.active || catSort.value) {
      sortOptions.classList.add(classes.custom);
    } else {
      sortOptions.classList.remove(classes.custom);
    }
  });

  createFragmentApp(
    InventorySortControls,
    reactive({
      sorting: modes,
      activeSort: toRef(() => sortingData.active),
      reverse: reverseSort,
      onModeClick: (mode: string) => {
        if (sortingData.active === mode) {
          reverseSort.value = !reverseSort.value;
        } else {
          sortingData.active = mode;
          catSort.value = false;
          reverseSort.value = false;
        }
      },
      onAddClick: () => showBuffer(`XIT SORT ${store?.id.substring(0, 8) ?? parameter}`),
    }),
  ).appendTo(sortOptions);

  const activeMode = computed(() => modes.value.find(x => x.label === sortingData.active));

  const scope = new FragmentAppScope();
  const runSort = () => {
    observer.disconnect();
    scope.begin();
    sortInventory(
      inventory,
      catSort.value ? categorySortingMode : activeMode.value,
      burn.value?.burn,
      reverseSort.value,
    );
    scope.end();
    setTimeout(() => observer.observe(inventory, { childList: true, subtree: true }), 0);
  };
  const observer = new MutationObserver(runSort);
  let first = true;
  watchEffectWhileNodeAlive(inventory, () => {
    // Touch reactive values.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = [sortingData.reverse, sortingData.active, sortingData.cat, burn.value];
    if (first) {
      first = false;
      runSort();
      return;
    }
    setTimeout(runSort, 50);
  });
}

function sortInventory(
  inventory: Element,
  sorting: UserData.SortingMode | undefined,
  burn: BurnValues | undefined,
  reverse: boolean,
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

  if (reverse) {
    categories.reverse();
  }

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
    if (reverse) {
      materials.reverse();
    }
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

  if (addedItems.size > 0) {
    createFragmentApp(CategoryHeader, { label: 'Other' }).appendTo(inventory);
  }
  let otherItems = [...remainingItems].map(x => ({
    div: x.div,
    material: materialsStore.getByTicker(x.ticker),
  }));
  otherItems = sortByMaterial(otherItems, x => x.material);
  if (reverse) {
    otherItems.reverse();
  }
  for (const item of otherItems) {
    inventory.appendChild(item.div);
  }
}

const categorySortingMode = {
  label: 'CAT',
  categories: [],
  burn: false,
  zero: false,
};

const burnSortingMode = {
  label: 'BRN',
  categories: [],
  burn: true,
  zero: true,
};

function init() {
  applyCssRule(`.${classes.custom} .${C.InventorySortControls.order} > div`, css.hidden);
  tiles.observe(['INV', 'SHPI'], onTileReady);
  xit.add({
    command: 'SORT',
    name: 'SORTING MODES',
    description: 'Sorting mode editor.',
    mandatoryParameters: 'Inventory Identifier',
    component: () => SORT,
  });
}

features.add(import.meta.url, init, 'Adds custom sorting modes to inventories.');
