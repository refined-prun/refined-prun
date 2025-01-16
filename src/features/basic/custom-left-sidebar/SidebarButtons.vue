<script setup lang="ts">
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { userData } from '@src/store/user-data';
import { canAcceptContract } from '@src/features/XIT/CONTS/utils';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import { vDraggable } from 'vue-draggable-plus';
import { objectId } from '@src/utils/object-id';

const { comPulse } = defineProps<{ comPulse?: boolean }>();

const pendingContracts = computed(
  () => contractsStore.all.value?.filter(canAcceptContract).length ?? 0,
);
const hasPendingContracts = computed(() => pendingContracts.value > 0);

const activeIndicator = [
  C.Frame.toggleIndicator,
  C.Frame.toggleIndicatorPulseActive,
  C.effects.shadowPulseSuccess,
];
const inactiveIndicator = [C.Frame.toggleIndicator, C.Frame.toggleIndicatorSecondary];

function indicatorClass(command: string) {
  if (command === 'COM' && comPulse) {
    return activeIndicator;
  }
  if (['CONTS', 'XIT CONTS'].includes(command) && hasPendingContracts.value) {
    return activeIndicator;
  }
  return inactiveIndicator;
}
</script>

<template>
  <div v-draggable="[userData.settings.sidebar, { animation: 150 }]">
    <div
      v-for="button in userData.settings.sidebar"
      :key="objectId(button)"
      :class="C.Frame.toggle"
      @click="() => showBuffer(button[1])">
      <span :class="[C.Frame.toggleLabel, C.fonts.fontRegular, C.type.typeRegular]">
        {{ button[0] }}
      </span>
      <div :class="indicatorClass(button[1])" />
    </div>
  </div>
</template>
