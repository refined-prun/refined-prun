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
      if (!label) {
        return;
      }
      const ticker = refTextContent(label);
      watchEffectWhileNodeAlive(gridItem, () => {
        if (store.value?.type !== 'STORE') {
          gridItem.classList.remove($style.unused);
          return;
        }
        const burn = getPlanetBurn(store.value.addressableId);
        if (!burn || !ticker.value) {
          gridItem.classList.remove($style.unused);
          return;
        }
        gridItem.classList.toggle($style.unused, burn.burn[ticker.value] === undefined);
      });
    });
  });
}

function init() {
  tiles.observe('INV', onTileReady);
}

features.add(import.meta.url, init, 'INV: Highlights unused materials with danger stripes.');
