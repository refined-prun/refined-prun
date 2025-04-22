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
  createFragmentApp(() =>
    isMinimized.value ? (
      <TileControlsButton
        icon={'\uf0c9'}
        marginTop={4}
        onClick={() => (isMinimized.value = false)}
      />
    ) : null,
  ).prependTo(tileControls);

  createFragmentApp(() => (
    <>
      <div
        class={[C.ContextControls.item, C.fonts.fontRegular, C.type.typeSmall]}
        onClick={() => {
          isMinimized.value = true;
        }}>
        <i class={[fa.solid]}>{'\uf070'}</i>
      </div>
      <div style={{ flexGrow: '1' }} />
    </>
  )).prependTo(tileContextControls);
}

function init() {
  tiles.observeAll(onTileReady);
}

features.add(
  import.meta.url,
  init,
  'Adds buttons to hide and show context controls for tiles containing them.',
);
