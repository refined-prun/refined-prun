import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import CargoBar from '@src/features/basic/flt-cargo-breakdown/CargoBar.vue';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'tr'), onRowReady);
}

function onRowReady(row: HTMLTableRowElement) {
  const id = refPrunId(row);

  const storageCell = row.querySelector('td:nth-child(3)');
  const storageProgress = storageCell?.querySelector('progress');

  if (!storageCell || !storageProgress) {
    return;
  }

  storageProgress.style.display = 'none';
  createFragmentApp(
    CargoBar,
    reactive({
      shipId: id,
      onClick: (e: MouseEvent) => {
        e.stopPropagation();
        storageProgress.click();
      },
    }),
  ).prependTo(storageCell);
}

function init() {
  tiles.observe(['FLT'], onTileReady);
}

features.add(
  import.meta.url,
  init,
  'FLT: Shows a more detailed inventory breakdown in the Cargo column.',
);
