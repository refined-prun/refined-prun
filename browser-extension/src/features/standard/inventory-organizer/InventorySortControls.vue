<script setup lang="ts">
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { showBuffer } from '@src/util';
import { computed } from 'vue';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { calculatePlanetBurn } from '@src/core/burn';

const props = defineProps({
  storeId: {
    type: String,
    required: true,
  },
});

const burn = computed(() => {
  const storage = storagesStore.getByShortId(props.storeId);
  const site = sitesStore.getById(storage?.addressableId);
  const workforce = workforcesStore.getById(site?.siteId)?.workforces;
  const production = productionStore.getBySiteId(site?.siteId);
  const stores = storagesStore.getByAddress(site?.siteId);
  return workforce ? calculatePlanetBurn(production, workforce, stores) : undefined;
});

function onAddClick() {
  showBuffer(`XIT SORT ${props.storeId}`);
}
</script>

<template>
  <div v-if="burn" :class="PrunCss.InventorySortControls.criteria"><div>BRN</div></div>
  <div :class="PrunCss.InventorySortControls.criteria" @click="onAddClick"><div>+</div></div>
</template>
