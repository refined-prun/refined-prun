<script setup lang="ts">
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { getMaterialCategoryCssClass } from '@src/infrastructure/prun-ui/item-tracker';
import { materialCategoriesStore } from '@src/infrastructure/prun-api/data/material-categories';
import { fixed02, percent0 } from '@src/utils/format';

const { shipId } = defineProps<{
  shipId: string | null;
  onClick: (e: MouseEvent) => void;
}>();

const $style = useCssModule();

interface Segment {
  name: string;
  class: string;
  borderClasses?: string[];
  width: string;
  title: string;
  load?: string;
}

interface CargoBar {
  segments: Segment[];
  miniMode: boolean;
}

const cargoBar = computed<CargoBar>(() => {
  const ship = shipsStore.getById(shipId);
  const inv = storagesStore.getById(ship?.idShipStore);
  if (!inv || inv.items.length === 0) {
    return {
      segments: [],
      miniMode: false,
    };
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
  let divisor = isMiniMode ? activeLoad : activeCapacity;
  if (divisor === 0) {
    divisor = 1;
  }

  const formatTitle = (name: string, weight: number, volume: number) => {
    const load = useVolume ? fixed02(volume) + 'm³' : fixed02(weight) + 't';
    return `${name}: ${load}`;
  };

  const segments = [] as Segment[];
  const summary = getInventorySummary(inv);

  const categories = [...summary.categories.keys()].sort((a, b) => a.name.localeCompare(b.name));
  for (const category of categories) {
    const categorySummary = summary.categories.get(category)!;
    const value = useVolume ? categorySummary.volume : categorySummary.weight;
    const percentage = (value * 100) / divisor;
    segments.push({
      name: category.name,
      class: getMaterialCategoryCssClass(category),
      width: `${percentage}%`,
      title: formatTitle(category.name, categorySummary.weight, categorySummary.volume),
    });
  }

  if (summary.shipments.weight > 0 || summary.shipments.volume > 0) {
    const value = useVolume ? summary.shipments.volume : summary.shipments.weight;
    const percentage = (value * 100) / divisor;
    segments.push({
      name: 'shipments',
      class: 'rp-category-none',
      width: `${percentage}%`,
      title: formatTitle('shipments', summary.shipments.weight, summary.shipments.volume),
    });
  }

  if (!isMiniMode) {
    enhanceSegmentVisibility(segments, maxRatio);
  }

  return {
    segments: segments,
    miniMode: isMiniMode,
  };
});

function enhanceSegmentVisibility(segments: Segment[], loadRatio: number) {
  // Oh, god, here we go.
  const lowContrastCategories = new Set(['elements', 'metals', 'shipments', 'unit prefabs']);

  const isAlmostFull = loadRatio > 0.98;
  if (segments.length === 1 && isAlmostFull) {
    const segment = segments[0];
    if (lowContrastCategories.has(segment.name)) {
      segment.load = percent0(loadRatio);
    }
    return;
  }

  for (let i = 1; i < segments.length; i++) {
    const current = segments[i];
    const previous = segments[i - 1];
    const currentLowContrast = lowContrastCategories.has(current.name);
    const previousLowContrast = lowContrastCategories.has(previous.name);

    if (currentLowContrast && previousLowContrast) {
      current.borderClasses = [$style.borderLeft];
    }
  }

  if (!isAlmostFull) {
    const last = segments[segments.length - 1];
    last.borderClasses ??= [];
    last.borderClasses.push($style.borderRight);
  }
}

interface CategorySummary {
  weight: number;
  volume: number;
}

function getInventorySummary(store: PrunApi.Store) {
  const shipments: CategorySummary = {
    weight: 0,
    volume: 0,
  };
  const categories = new Map<PrunApi.MaterialCategory, CategorySummary>();

  for (const item of store.items) {
    if (item.type === 'SHIPMENT') {
      shipments.weight += item.weight;
      shipments.volume += item.volume;
      continue;
    }

    const material = item.quantity?.material;
    if (!material) {
      continue;
    }

    const category = materialCategoriesStore.getById(material.category);
    if (!category) {
      continue;
    }

    let categorySummary = categories.get(category);
    if (!categorySummary) {
      categorySummary = { weight: 0, volume: 0 };
      categories.set(category, categorySummary);
    }

    categorySummary.weight += item.weight;
    categorySummary.volume += item.volume;
  }

  return { shipments, categories };
}

const miniBarClass = computed(() => ({
  [$style.miniBar]: cargoBar.value.miniMode,
}));
</script>

<template>
  <div :class="[C.ProgressBar.progress, $style.container]" @click="onClick">
    <div :class="[$style.bar, miniBarClass]">
      <div
        v-for="segment in cargoBar.segments"
        :key="segment.name"
        :class="[$style.segment, segment.class, segment.borderClasses]"
        :style="{ width: segment.width }"
        :title="segment.title">
        <div v-if="segment.load" :class="$style.full">
          {{ segment.load }}
        </div>
      </div>
    </div>
  </div>
</template>

<style module>
.container {
  cursor: pointer;
  display: flex;
  width: 100%;
  min-width: 30px;
  height: 12px;
  align-items: flex-end;
  justify-content: flex-start;
}

.bar {
  width: 100%;
  height: 100%;
  display: flex;
}

.miniBar {
  width: 25%;
  height: 50%;
  border-top: 1px solid #999;
  border-right: 1px solid #999;
}

.segment {
  height: 100%;
}

.borderLeft {
  border-left: 1px solid #999;
}

.borderRight {
  border-right: 1px solid #999;
}

.full {
  width: 100%;
  font-size: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
