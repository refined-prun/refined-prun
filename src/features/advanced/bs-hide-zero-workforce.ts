import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { isEmpty } from 'ts-extras';

function onTileReady(tile: PrunTile) {
  // Only process BS {base} tiles
  if (!tile.parameter) {
    return;
  }

  subscribe($$(tile.anchor, C.Site.container), () => {
    subscribe($$(tile.anchor, 'th'), header => {
      header.innerText = header.innerText.replace('Current Workforce', 'Current');
    });

    subscribe($$(tile.anchor, 'tr'), row => {
      if (isEmpty(_$$(row, 'td'))) {
        return;
      }

      const levelId = refPrunId(row);
      const shouldHideRow = computed(() => {
        const site = sitesStore.getByPlanetNaturalId(tile.parameter);
        const workforce = workforcesStore
          .getById(site?.siteId)
          ?.workforces.find(x => x.level === levelId.value);
        return (
          workforce && workforce.capacity < 1 && workforce.required < 1 && workforce.population < 1
        );
      });
      watchEffectWhileNodeAlive(row, () => (row.style.display = shouldHideRow.value ? 'none' : ''));
    });
  });
}

function init() {
  tiles.observe('BS', onTileReady);
}

features.add(import.meta.url, init, 'BS: Hides workforce rows with zero current workforce.');
