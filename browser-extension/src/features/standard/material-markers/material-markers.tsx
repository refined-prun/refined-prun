import features from '@src/feature-registry';
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
import { getTileState } from './tile-state';

async function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, PrunCss.StoreView.container), container => {
    subscribe($$(container, PrunCss.GridItemView.image), item => {
      if (!item.children[1]) {
        void addMarker(item, tile);
      }
    });
  });
}

interface Icon {
  character: string;
  color: string;
}

const icons: Icon[] = [
  { character: '\uf02e', color: '#CC220E' },
  { character: '\uf005', color: '#F7A601' },
  { character: '\uf135', color: '#088DBF' },
  { character: '\uf02b', color: '#C9C9C9' },
  { character: '\uf1f8', color: '#3A8018' },
];

async function addMarker(mat: HTMLElement, tile: PrunTile) {
  const matTickerElem = await $(mat, PrunCss.ColoredIcon.label);
  const ticker = refTextContent(matTickerElem);
  const state = computedTileState(getTileState(tile), 'markers', {});
  const markerId = computed({
    get: () => (ticker.value !== null ? state.value[ticker.value] : 0) ?? 0,
    set: id => {
      if (ticker.value === null) {
        return;
      }
      const result = { ...state.value };
      if (id === 0) {
        delete result[ticker.value];
      } else {
        result[ticker.value] = id;
      }
      state.value = result;
    },
  });
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
      marker: computed(() => icons[markerId.value - 1]?.character),
      color: computed(() => icons[markerId.value - 1]?.color),
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
  id: 'material-markers',
  init,
});
