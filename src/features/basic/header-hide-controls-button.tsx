import { createFragmentApp } from '@src/utils/vue-fragment-app';
import TileControlsButton from '@src/components/TileControlsButton.vue';
import { computedTileState } from '@src/store/user-data-tiles';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import css from '@src/utils/css-utils.module.css';
import { getTileState as getBaseTileState } from '@src/store/user-data-tiles';
import fa from '@src/utils/font-awesome.module.css';

interface TileState extends UserData.TileState {
  minimizeContextControls: boolean;
}

function getTileState(tile: PrunTile) {
  return computed(() => getBaseTileState(tile) as TileState);
}

async function onTileReady(tile: PrunTile) {
  const tileContextControls = await $(tile.frame, C.ContextControls.container);

  const isMinimized = computedTileState(getTileState(tile), 'minimizeContextControls', false);
  watchEffectWhileNodeAlive(tile.anchor, () => {
    tileContextControls.classList.toggle(css.hidden, isMinimized.value);
  });

  const tileControls = await $(tile.frame, C.TileFrame.controls);
  const display = computed(() => (isMinimized.value ? '' : css.HIDDEN));
  createFragmentApp(() => (
    <TileControlsButton
      class={[display.value]}
      icon=""
      marginTop={4}
      onClick={() => (isMinimized.value = false)}
    />
  )).before(tileControls.children[0]);

  const flexDiv = document.createElement('div');
  flexDiv.style.flexGrow = '1';
  tileContextControls.children[0].insertAdjacentElement('beforebegin', flexDiv);

  createFragmentApp(() => (
    <div
      class={[C.ContextControls.item, C.fonts.fontRegular, C.type.typeSmall]}
      onClick={() => {
        isMinimized.value = true;
      }}>
      <i class={[fa.solid]}></i>
    </div>
  )).before(tileContextControls.children[0]);
}

function init() {
  tiles.observeAll(onTileReady);
}

features.add(
  import.meta.url,
  init,
  'Adds a button to hide and show context controls for buffers containing them.',
);
