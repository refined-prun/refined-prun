import { subscribe } from '@src/utils/subscribe-async-generator';
import { $$, _$$ } from '@src/utils/select-dom';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import { computed, reactive } from 'vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { isRepairableBuilding } from '@src/core/buildings';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import ProgressBar from '@src/components/ProgressBar.vue';

function onTileReady(tile: PrunTile) {
  const siteId = tile.parameter;
  const site = computed(() => sitesStore.getById(siteId));
  subscribe($$(tile.anchor, PrunCss.SectionList.section), section => {
    const id = refPrunId(section);
    const building = computed(() => site.value?.platforms.find(p => p.id == id.value));
    if (!building.value || !isRepairableBuilding(building.value)) {
      return;
    }
    const rows = _$$(section, 'tr');
    const condition = computed(() => building.value?.condition);
    const good = computed(() => condition.value && condition.value > 0.9);
    const warning = computed(() => !good.value && condition.value && condition.value > 0.8);
    const danger = computed(() => condition.value && condition.value <= 0.8);
    createFragmentApp(
      ProgressBar,
      reactive({
        value: condition,
        max: 1,
        good,
        warning,
        danger,
      }),
    ).before(rows[5].children[1].firstChild!);
  });
}

function init() {
  tiles.observe('BBL', onTileReady);
}

features.add({
  id: 'bbl-add-condition-progress-bar',
  description: 'BBL: Adds a progress bar to the building condition row.',
  init,
});
