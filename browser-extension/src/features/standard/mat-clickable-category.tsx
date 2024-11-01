import features from '@src/feature-registry';
import tiles from '@src/infrastructure/prun-ui/tiles';
import { subscribe } from '@src/utils/subscribe-async-generator';
import { $$, _$$ } from '@src/utils/select-dom';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import {
  materialCategoriesStore,
  toSerializableCategoryName,
} from '@src/infrastructure/prun-api/data/material-categories';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

function onTileReady(tile: PrunTile) {
  const parameter = tile.parameter;
  const material = materialsStore.getByTicker(parameter);
  const category = materialCategoriesStore.getById(material?.category);
  if (!category) {
    return;
  }

  subscribe($$(tile.anchor, PrunCss.MaterialInformation.container), async container => {
    const fields = _$$(container, PrunCss.StaticInput.static);
    const categoryField = fields[1];
    if (!categoryField) {
      return;
    }

    categoryField.classList.add(PrunCss.Link.link);
    categoryField.addEventListener('click', () => {
      showBuffer('XIT MATS ' + toSerializableCategoryName(category.name));
    });
  });
}

export function init() {
  tiles.observe('MAT', onTileReady);
}

void features.add({
  id: 'mat-clickable-category',
  description:
    'MAT: Makes material category clickable and leading to XIT MATS with the material category.',
  init,
});
