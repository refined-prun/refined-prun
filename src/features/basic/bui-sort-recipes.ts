import { compareMaterials } from '@src/core/sort-materials';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

interface Recipe {
  element: HTMLElement;
  inputs?: MaterialAmount[];
  outputs?: MaterialAmount[];
}

interface MaterialAmount {
  element: HTMLElement;
  material: PrunApi.Material | undefined;
  amount: number;
}

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.BuildingInformation.recipeList), recipeList => {
    const recipes = _$$(recipeList, C.BuildingInformation.recipe);
    const parsed = recipes.map(parseRecipe);
    parsed.sort(compareRecipes);
    reorder(parsed);
    for (const recipe of parsed) {
      reorder(recipe.inputs);
      reorder(recipe.outputs);
    }
  });
}

function parseRecipe(element: HTMLElement): Recipe {
  const inputsContainer = _$(element, C.BuildingInformation.inputs);
  if (!inputsContainer) {
    return {
      element: element,
    };
  }

  const allMaterials = _$$(element, C.MaterialIcon.container);
  const inputMaterials = _$$(inputsContainer, C.MaterialIcon.container);
  const outputMaterials = allMaterials.filter(x => !inputMaterials.includes(x));

  return {
    element: element,
    inputs: inputMaterials
      .map(parseMaterialAmount)
      .sort((a, b) => compareMaterials(a.material, b.material)),
    outputs: outputMaterials
      .map(parseMaterialAmount)
      .sort((a, b) => compareMaterials(a.material, b.material)),
  };
}

function reorder(items?: { element: HTMLElement }[]) {
  if (!items) {
    return;
  }

  for (let i = 1; i < items.length; i++) {
    items[i - 1].element.after(items[i].element);
  }
}

function parseMaterialAmount(element: HTMLElement): MaterialAmount {
  const material = materialsStore.getByTicker(_$(element, C.ColoredIcon.label)?.textContent);
  const amount = Number(_$(element, C.MaterialIcon.indicator)?.textContent ?? 0);
  const parent = element.parentElement!;
  // For some reason, MaterialIcon.container elements are wrapped in an additional div,
  // so we need to reorder those divs instead of the MaterialIcon element itself.
  // This check is here in case molp changes it so the MaterialIcon elements become
  // direct children of the BuildingInformation.recipe element.
  const targetElement = parent.classList.contains(C.BuildingInformation.recipe) ? element : parent;
  return { element: targetElement, material, amount };
}

function compareRecipes(a: Recipe, b: Recipe) {
  if (!a.outputs && !b.outputs) {
    return 0;
  }

  if (!a.outputs) {
    return 1;
  }

  if (!b.outputs) {
    return -1;
  }

  const result = compareMaterialList(a.outputs, b.outputs);
  if (result !== 0) {
    return result;
  }

  return compareMaterialList(a.inputs ?? [], b.inputs ?? []);
}

function compareMaterialList(a: MaterialAmount[], b: MaterialAmount[]) {
  const length = Math.min(a.length, b.length);
  for (let i = 0; i < length; i++) {
    if (a.length <= i) {
      return -1;
    }

    if (b.length <= i) {
      return 1;
    }

    const result = compareMaterials(a[i].material, b[i].material);
    if (result !== 0) {
      return result;
    }

    if (a[i].amount < b[i].amount) {
      return -1;
    }

    if (a[i].amount > b[i].amount) {
      return 1;
    }
  }

  return 0;
}

function init() {
  tiles.observe('BUI', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'BUI: Sorts the recipes and materials by category/ticker/amount sort order.',
);
