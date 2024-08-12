<script setup lang="ts">
import { settings } from '@src/store/settings';
import PrunCss from '@src/prun-ui/prun-css';
import { computed } from 'vue';

const props = defineProps({
  days: {
    type: Number,
    required: true,
  },
});

const days = computed(() => Math.floor(props.days));
const burnClass = computed(() => ({
  [PrunCss.Workforces.daysMissing]: days.value <= settings.burn.red,
  [PrunCss.Workforces.daysWarning]: days.value <= settings.burn.yellow,
  [PrunCss.Workforces.daysSupplied]: days.value > settings.burn.yellow,
}));
</script>

<template>
  <td :style="{ position: 'relative' }">
    <div
      :style="{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }"
      :class="burnClass" />
    <span>{{ days < 500 ? days : '∞' }}</span>
  </td>
</template>
