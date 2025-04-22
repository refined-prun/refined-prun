import { createFragmentApp } from '@src/utils/vue-fragment-app';
import IconMarker from './IconMarker.vue';
import { computedTileState } from '@src/store/user-data-tiles';
import { refTextContent } from '@src/utils/reactive-dom';
import { getTileState } from './tile-state';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.StoreView.container), container => {
    subscribe($$(container, C.GridItemView.image), item => {
      if (item.children[1] === undefined) {
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
  const matTickerElem = await $(mat, C.ColoredIcon.label);
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

function init() {
  tiles.observe(['INV', 'SHPI'], onTileReady);
}

features.add(import.meta.url, init, 'Adds bottom-left item markers.');
