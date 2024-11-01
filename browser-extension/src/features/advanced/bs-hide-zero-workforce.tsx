import { subscribe } from '@src/utils/subscribe-async-generator';
import { $$ } from '@src/utils/select-dom';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { watchEffectWhileNodeAlive } from '@src/utils/watch-effect-while-node-alive';
import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { computed } from 'vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';

async function onTileReady(tile: PrunTile) {
  // Only process BS {base} tiles
  if (!tile.parameter) {
    return;
  }

  subscribe($$(tile.anchor, PrunCss.Site.container), () => {
    subscribe($$(tile.anchor, 'th'), header => {
      header.innerText = header.innerText.replace('Current Workforce', 'Current');
    });

    subscribe($$(tile.anchor, 'tr'), row => {
      const cells = row.getElementsByTagName('td');
      if (cells.length === 0) {
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

export function init() {
  tiles.observe('BS', onTileReady);
}

void features.add({
  id: 'bs-hide-zero-workforce',
  description:
    'BS: Renames the "Current Workforce" column header to "Current" and hides rows with zero workforce.',
  init,
});
