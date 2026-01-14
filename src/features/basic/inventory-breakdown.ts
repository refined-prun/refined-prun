import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { getInvStore } from '@src/core/store-id';
import { materialCategoriesStore } from '@src/infrastructure/prun-api/data/material-categories';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import $style from './inventory-breakdow.module.css';

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

  if (!storageCell || !storageProgress) return;

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
    const inv = inventory.value;
    const items = inv?.items ?? [];

    const wCap = inv?.weightCapacity ?? 1;
    const vCap = inv?.volumeCapacity ?? 1;
    const wLoad = inv?.weightLoad ?? 0;
    const vLoad = inv?.volumeLoad ?? 0;

    const weightRatio = wLoad / wCap;
    const volumeRatio = vLoad / vCap;
    const maxRatio = Math.max(weightRatio, volumeRatio);
    const useVolume = volumeRatio > weightRatio;

    const isMiniMode = maxRatio <= 0.05 && maxRatio > 0;
    const activeLoad = useVolume ? vLoad : wLoad;
    const activeCapacity = useVolume ? vCap : wCap;

    newBar.innerHTML = '';
    let segmentTarget: HTMLElement = newBar;

    if (isMiniMode) {
      const miniBar = document.createElement('div');
      miniBar.classList.add($style.miniBar);
      miniBar.classList.add(C.ProgressBar.progress);

      newBar.appendChild(miniBar);
      segmentTarget = miniBar;
    }

    items.forEach(item => {
      if (!item.quantity) return;

      const fill = document.createElement('div');
      const category = materialCategoriesStore.getCategoryByMaterialIdentifier(
        item.quantity.material.ticker,
      );
      const name =
        category?.name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '') ?? 'unknown';

      fill.classList.add($style.fill);
      fill.classList.add('rp-category-' + name);

      const itemValue = useVolume ? item.volume : item.weight;
      const divisor = isMiniMode ? activeLoad : activeCapacity;
      const percentage = (itemValue * 100) / (divisor || 1);

      fill.style.width = `${percentage}%`;
      fill.title = `${item.quantity.material.ticker}: ${useVolume ? item.volume.toFixed(2) + 'm³' : item.weight.toFixed(2) + 't'}`;

      segmentTarget.appendChild(fill);
    });
  });
}

function init() {
  tiles.observe(['FLT'], onTileReady);
}

features.add(import.meta.url, init, 'Shows a more detailed inventory breakdown in ship lists.');
