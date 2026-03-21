import { getInvStore } from '@src/core/store-id';
import { getPlanetBurn } from '@src/core/burn';
import { refTextContent } from '@src/utils/reactive-dom';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import $style from './inv-unused-item-stripes.module.css';

function onTileReady(tile: PrunTile) {
  const store = computed(() => getInvStore(tile.parameter));

  subscribe($$(tile.anchor, C.StoreView.container), container => {
    subscribe($$(container, C.GridItemView.container), gridItem => {
      const label = _$(gridItem, C.ColoredIcon.label);
      const icon = _$(gridItem, C.ColoredIcon.container);
      if (!label || !icon) {
        return;
      }
      const ticker = refTextContent(label);
      const originalTitle = icon.getAttribute('title') ?? '';
      watchEffectWhileNodeAlive(gridItem, () => {
        if (store.value?.type !== 'STORE') {
          gridItem.classList.remove($style.unused);
          icon.setAttribute('title', originalTitle);
          return;
        }
        const burn = getPlanetBurn(store.value.addressableId);
        if (!burn || !ticker.value) {
          gridItem.classList.remove($style.unused);
          icon.setAttribute('title', originalTitle);
          return;
        }
        const isUnused = burn.burn[ticker.value] === undefined;
        gridItem.classList.toggle($style.unused, isUnused);
        if (isUnused) {
          icon.setAttribute(
            'title',
            `${originalTitle}\n(Not used by any production order or workforce)`,
          );
        } else {
          icon.setAttribute('title', originalTitle);
        }
      });
    });
  });
}

function init() {
  tiles.observe('INV', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'INV: Highlights materials not used by base production or workforce with danger stripes.',
);
