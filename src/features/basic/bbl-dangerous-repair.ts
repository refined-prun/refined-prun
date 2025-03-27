import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import { isRepairableBuilding } from '@src/core/buildings';

function onTileReady(tile: PrunTile) {
  const siteId = tile.parameter;
  const site = computed(() => sitesStore.getById(siteId));
  subscribe($$(tile.anchor, C.SectionList.section), section => {
    const id = refPrunId(section);
    const building = computed(() => site.value?.platforms.find(p => p.id == id.value));
    subscribe($$(tile.anchor, C.SectionList.button), buttons => {
      const repair = buttons.children[0];
      if (!repair) {
        return;
      }
      watchEffectWhileNodeAlive(repair, () => {
        if (!building.value || !isRepairableBuilding(building.value)) {
          return;
        }

        if (building.value.condition > 0.98) {
          repair.classList.add(C.Button.danger);
        } else {
          repair.classList.remove(C.Button.danger);
        }
      });
    });
  });
}

function init() {
  tiles.observe('BBL', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'BBL: Applies the "danger" style to the "Repair" button if the building condition is >98%.',
);
