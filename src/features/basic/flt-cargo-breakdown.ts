import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { getInvStore } from '@src/core/store-id';
import { getStoreItemCategoryCssClass } from '@src/infrastructure/prun-ui/item-tracker';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import $style from './flt-cargo-breakdown.module.css';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'tr'), onRowReady);
}

function onRowReady(row: HTMLTableRowElement) {
  const id = refPrunId(row);

  const inventory = computed(() => {
    const ship = shipsStore.getById(id.value);
    return getInvStore(ship?.idShipStore);
  });

  const storageCell = row.querySelector('td:nth-child(3)');
  const storageProgress = storageCell?.querySelector('progress');

  if (!storageCell || !storageProgress) {
    return;
  }

  const newBar = document.createElement('div');
  newBar.classList.add($style.container);
  newBar.classList.add(C.ProgressBar.progress);

  newBar.addEventListener('click', e => {
    e.stopPropagation();
    storageProgress.click();
  });

  storageProgress.style.display = 'none';
  storageCell.prepend(newBar);

  watchEffectWhileNodeAlive(row, () => {
    newBar.replaceChildren();
    const inv = inventory.value;
    if (!inv) {
      return;
    }

    const wCap = inv.weightCapacity;
    const vCap = inv.volumeCapacity;
    const wLoad = inv.weightLoad;
    const vLoad = inv.volumeLoad;

    const weightRatio = wLoad / wCap;
    const volumeRatio = vLoad / vCap;
    const maxRatio = Math.max(weightRatio, volumeRatio);
    const useVolume = volumeRatio > weightRatio;

    const isMiniMode = maxRatio <= 0.05 && maxRatio > 0;
    const activeLoad = useVolume ? vLoad : wLoad;
    const activeCapacity = useVolume ? vCap : wCap;

    let segmentTarget: HTMLElement = newBar;

    if (isMiniMode) {
      const miniBar = document.createElement('div');
      miniBar.classList.add($style.miniBar);
      miniBar.classList.add(C.ProgressBar.progress);

      newBar.appendChild(miniBar);
      segmentTarget = miniBar;
    }

    for (const item of inv.items) {
      let ticker = item.quantity?.material.ticker;
      if (item.type === 'SHIPMENT') {
        ticker = 'SHPT';
      }

      const fill = document.createElement('div');
      const categoryCssClass = getStoreItemCategoryCssClass(item);
      if (categoryCssClass) {
        fill.classList.add(categoryCssClass);
      }

      fill.classList.add($style.fill);

      const itemValue = useVolume ? item.volume : item.weight;
      let divisor = isMiniMode ? activeLoad : activeCapacity;
      if (divisor === 0) {
        divisor = 1;
      }
      const percentage = (itemValue * 100) / divisor;

      fill.style.width = `${percentage}%`;
      fill.title = `${ticker}: ${useVolume ? item.volume.toFixed(2) + 'm³' : item.weight.toFixed(2) + 't'}`;

      segmentTarget.appendChild(fill);
    }
  });
}

function init() {
  tiles.observe(['FLT'], onTileReady);
}

features.add(
  import.meta.url,
  init,
  'FLT: Shows a more detailed inventory breakdown in the Cargo column.',
);
