import { subscribe } from '@src/utils/subscribe-async-generator';
import { $$ } from '@src/utils/select-dom';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { computed } from 'vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { watchEffectWhileNodeAlive } from '@src/utils/watch-effect-while-node-alive';
import { isRepairableBuilding } from '@src/core/buildings';

function onTileReady(tile: PrunTile) {
  const siteId = tile.parameter;
  const site = computed(() => sitesStore.getById(siteId));
  subscribe($$(tile.anchor, PrunCss.SectionList.section), section => {
    const id = refPrunId(section);
    const building = computed(() => site.value?.platforms.find(p => p.id == id.value));
    return subscribe($$(tile.anchor, PrunCss.SectionList.button), buttons => {
      const repair = buttons.children[0];
      if (!repair) {
        return;
      }
      watchEffectWhileNodeAlive(repair, () => {
        if (!building.value || !isRepairableBuilding(building.value)) {
          return;
        }

        if (building.value.condition > 0.98) {
          repair.classList.add(PrunCss.Button.danger);
        } else {
          repair.classList.remove(PrunCss.Button.danger);
        }
      });
    });
  });
}

function init() {
  tiles.observe('BBL', onTileReady);
}

features.add({
  id: 'bbl-repair-danger',
  description:
    'BBL: Applies the "danger" style to the "Repair" button if the building condition is >98%.',
  init,
});
