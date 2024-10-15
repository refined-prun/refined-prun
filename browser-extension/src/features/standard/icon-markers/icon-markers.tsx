import features from '@src/feature-registry';
import system from '@src/system';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import IconMarker from './IconMarker.vue';
import { computed, reactive } from 'vue';
import { $, $$ } from '@src/utils/select-dom';
import { subscribe } from '@src/utils/subscribe-async-generator';
import tiles from '@src/infrastructure/prun-ui/tiles';
import { computedTileState } from '@src/store/user-data-tiles';
import { refTextContent } from '@src/utils/reactive-dom';
import { getTileState } from '@src/features/standard/icon-markers/tile-state';

async function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, PrunCss.StoreView.container), container => {
    subscribe($$(container, PrunCss.GridItemView.image), item => {
      if (!item.children[1]) {
        void addMarker(item, tile);
      }
    });
  });
}

const icons = ['bookmark', 'star', 'rocket', 'tag', 'trash'];

async function addMarker(mat: HTMLElement, tile: PrunTile) {
  const matTickerElem = await $(mat, PrunCss.ColoredIcon.label);
  const ticker = refTextContent(matTickerElem);
  const markers = computedTileState(getTileState(tile), 'markers', {});
  const markerId = computed({
    get: () => (ticker.value !== null ? markers.value[ticker.value] : 0) ?? 0,
    set: id => {
      if (ticker.value === null) {
        return;
      }
      const result = { ...markers.value };
      if (id === 0) {
        delete result[ticker.value];
      } else {
        result[ticker.value] = id;
      }
      markers.value = result;
    },
  });
  const markerFile = computed(() =>
    markerId.value > 0
      ? system.runtime.getURL(`images/${icons[markerId.value - 1]}-icon.svg`)
      : undefined,
  );
  const wrapStatus = (value: number) => {
    if (value < 0) {
      return icons.length;
    }
    if (value > icons.length) {
      return 0;
    }
    return value;
  };
  mat.style.position = 'relative';
  createFragmentApp(
    IconMarker,
    reactive({
      marker: markerFile,
      onNext: () => (markerId.value = wrapStatus(markerId.value + 1)),
      onPrevious: () => (markerId.value = wrapStatus(markerId.value - 1)),
    }),
  ).appendTo(mat);
}

export function init() {
  if (companyStore.value?.code === 'KCB') {
    return;
  }
  tiles.observe(['INV', 'SHPI'], onTileReady);
}

void features.add({
  id: 'icon-markers',
  init,
});
