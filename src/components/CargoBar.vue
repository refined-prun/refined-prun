<script setup lang="ts">
import {
  getMaterialCategoryCssClass,
  CATEGORY_CSS_PREFIX,
} from '@src/infrastructure/prun-ui/item-tracker';
import { materialCategoriesStore } from '@src/infrastructure/prun-api/data/material-categories';
import { fixed02 } from '@src/utils/format';
import { ref, watch, computed, onUnmounted } from 'vue';

const props = defineProps<{
  store: PrunApi.Store | null | undefined;
  tall?: boolean;
  onClick?: () => void;
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

interface CargoBarData {
  segments: Segment[];
  miniMode: boolean;
  isOverflowing: boolean;
}

const cargoBar = computed<CargoBarData>(() => {
  const inv = props.store;
  if (!inv || inv.items.length === 0) {
    return {
      segments: [],
      miniMode: false,
      isOverflowing: false,
    };
  }

  const wCap = inv.weightCapacity;
  const vCap = inv.volumeCapacity;
  const wLoad = inv.weightLoad;
  const vLoad = inv.volumeLoad;

  const weightRatio = wCap > 0 ? wLoad / wCap : 0;
  const volumeRatio = vCap > 0 ? vLoad / vCap : 0;
  const maxRatio = Math.max(weightRatio, volumeRatio);
  const useVolume = volumeRatio > weightRatio;

  const isMiniMode = maxRatio <= 0.05 && maxRatio > 0;
  const activeLoad = useVolume ? vLoad : wLoad;
  const activeCapacity = useVolume ? vCap : wCap;
  const isOverflowing = maxRatio > 1;
  // Scale factor applied to all category widths when overflowing, so the
  // category segments plus the final overflow segment add up to 100%.
  const overflowScale = isOverflowing ? 1 / maxRatio : 1;
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
    const percentage = ((value * 100) / divisor) * overflowScale;
    segments.push({
      name: category.name,
      class: getMaterialCategoryCssClass(category),
      width: `${percentage}%`,
      title: formatTitle(category.name, categorySummary.weight, categorySummary.volume),
    });
  }

  if (summary.shipments.weight > 0 || summary.shipments.volume > 0) {
    const value = useVolume ? summary.shipments.volume : summary.shipments.weight;
    const percentage = ((value * 100) / divisor) * overflowScale;
    segments.push({
      name: 'shipments',
      class: `${CATEGORY_CSS_PREFIX}none`,
      width: `${percentage}%`,
      title: formatTitle('shipments', summary.shipments.weight, summary.shipments.volume),
    });
  }

  if (isOverflowing) {
    const overflowPercent = ((maxRatio - 1) / maxRatio) * 100;
    const overAmount = useVolume ? vLoad - vCap : wLoad - wCap;
    const unit = useVolume ? 'm³' : 't';
    segments.push({
      name: 'overflow',
      class: $style.overflow,
      width: `${overflowPercent}%`,
      title: `Over capacity by ${fixed02(overAmount)}${unit}`,
    });
  }

  if (!isMiniMode) {
    enhanceSegmentVisibility(segments, maxRatio);
  }

  return {
    segments: segments,
    miniMode: isMiniMode,
    isOverflowing,
  };
});

function enhanceSegmentVisibility(segments: Segment[], loadRatio: number) {
  const lowContrastCategories = new Set(['elements', 'metals', 'shipments', 'unit prefabs']);

  const isAlmostFull = loadRatio > 0.98;
  if (segments.length === 1 && isAlmostFull) {
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

const isAnimating = ref(false);
let animationTimeout: ReturnType<typeof setTimeout> | null = null;

watch(
  () => cargoBar.value.segments,
  () => {
    if (animationTimeout) {
      clearTimeout(animationTimeout);
    }
    isAnimating.value = true;
    animationTimeout = setTimeout(() => {
      isAnimating.value = false;
    }, 1000);
  },
  { deep: true },
);

onUnmounted(() => {
  if (animationTimeout) {
    clearTimeout(animationTimeout);
  }
});

const totalLoadRatio = computed(() => {
  const inv = props.store;
  if (!inv) {
    return 0;
  }
  const w = inv.weightCapacity > 0 ? inv.weightLoad / inv.weightCapacity : 0;
  const v = inv.volumeCapacity > 0 ? inv.volumeLoad / inv.volumeCapacity : 0;
  return Math.max(w, v);
});

const stripeAlertColor = computed(() => {
  const ratio = totalLoadRatio.value;
  const start = { r: 50, g: 50, b: 50 };
  const target = { r: 100, g: 100, b: 100 };
  if (ratio < 0.7) {
    return `rgb(${start.r}, ${start.g}, ${start.b})`;
  }
  const normalized = (ratio - 0.7) / 0.3;
  const r = Math.round(start.r + (target.r - start.r) * normalized);
  const g = Math.round(start.g + (target.g - start.g) * normalized);
  const b = Math.round(start.b + (target.b - start.b) * normalized);
  return `rgb(${r}, ${g}, ${b})`;
});

const stripeWidth = computed(() => {
  const ratio = totalLoadRatio.value;
  const startWidth = 10;
  const smallWidth = 2;
  if (ratio < 0.7) {
    return `${startWidth}px`;
  }
  const normalized = (ratio - 0.7) / 0.3;
  const width = startWidth - (startWidth - smallWidth) * normalized;
  return `${width}px`;
});

const containerCursor = computed(() => (props.onClick ? 'pointer' : 'default'));

function handleClick() {
  props.onClick?.();
}
</script>

<template>
  <div
    :class="[
      C.ProgressBar.progress,
      $style.container,
      {
        [$style.isUpdating]: isAnimating,
        [$style.tall]: tall,
        [$style.isHazard]: cargoBar.isOverflowing,
      },
    ]"
    :style="{
      '--stripe-color': stripeAlertColor,
      '--stripe-width': stripeWidth,
      cursor: containerCursor,
    }"
    @click="handleClick">
    <div :class="[$style.bar, miniBarClass]">
      <div
        v-for="segment in cargoBar.segments"
        :key="segment.name"
        :class="[$style.segment, segment.class, segment.borderClasses]"
        :style="{ width: segment.width }"
        :data-tooltip="segment.title"
        data-tooltip-position="top">
        <div v-if="segment.load" :class="$style.full">
          {{ segment.load }}
        </div>
      </div>
    </div>
  </div>
</template>

<style module>
.container {
  margin: 0px;
  display: flex;
  min-width: 30px;
  width: 100%;
  min-height: 13px;
  height: 13px;
  align-items: flex-end;
  justify-content: flex-start;
  background-color: #2a2a2a;
  --stripe-width: 10px;
  --hypotenuse: calc(var(--stripe-width) * sqrt(2));

  background-image: repeating-linear-gradient(
    45deg,
    #2a2a2a,
    #2a2a2a calc(var(--stripe-width) / 2),
    var(--stripe-color) calc(var(--stripe-width) / 2),
    var(--stripe-color) var(--stripe-width)
  );
  background-size: var(--hypotenuse) var(--hypotenuse);
}

.tall {
  min-height: 24px;
  height: 24px;
}

.isUpdating {
  animation: move-stripes 0.5s linear infinite;
}

@keyframes move-stripes {
  from {
    background-position: 0 0;
  }
  to {
    background-position: var(--hypotenuse) 0;
  }
}

.bar {
  width: 100%;
  height: 100%;
  display: flex;
}

/* Override the inline-block applied by [data-tooltip] globally — flex items
   still respect width, but we need block display for segment sizing. */
.segment {
  display: block;
  height: 100%;
  padding: 0;
}

.miniBar {
  width: 25%;
  height: 50%;
  border-top: 1px solid #999;
  border-right: 1px solid #999;
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

.overflow {
  /* Hazard-tape pattern: saturated yellow + black diagonal stripes with a
     thick red outline. Universal "warning zone" idiom, unmistakable against
     the muted category segments in hazard mode. */
  background-image: repeating-linear-gradient(
    45deg,
    #000 0,
    #000 6px,
    #ffd500 6px,
    #ffd500 12px
  ) !important;
  background-color: #ffd500 !important;
  outline: 2px solid #d9534f;
  outline-offset: -2px;
  box-shadow: 0 0 4px 1px #d9534f;
  z-index: 2;
}

/* When the bar is overflowing, mute category segments and stamp a subtle
   hazard overlay across the whole bar so the whole row reads as "danger." */
.isHazard .segment {
  filter: saturate(0.35) brightness(0.7);
}

.isHazard .bar {
  position: relative;
}

.isHazard .bar::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    45deg,
    transparent 0,
    transparent 8px,
    rgba(255, 213, 0, 0.15) 8px,
    rgba(255, 213, 0, 0.15) 16px
  );
  pointer-events: none;
  z-index: 1;
}
</style>
