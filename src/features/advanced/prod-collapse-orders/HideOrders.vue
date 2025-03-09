<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import { clamp } from '@src/utils/clamp';

const props = defineProps<{
  headerOrdersInfo: number[];
  capacity: number;
  slots: number;
  setOrdersDisplay: (keepProdAmt: number, keepQueueAmt: number) => void;
  displayAllOrders: () => void;
}>();

const keepCapacity = ref<number>();
const keepSlots = ref<number>();
const state = ref<0 | 1 | 2>(0);

function unHide() {
  props.displayAllOrders();
  state.value = 0;
}

function hideOrders() {
  if (!keepCapacity.value && !keepSlots.value) {
    state.value = 0;
    return;
  }
  props.setOrdersDisplay(
    clamp(keepCapacity.value ?? 0, 0, props.capacity),
    clamp(keepSlots.value ?? 0, 0, props.slots),
  );
  state.value = 2;
}

if (props.headerOrdersInfo) {
  keepCapacity.value = props.headerOrdersInfo[0];
  keepSlots.value = props.headerOrdersInfo[1];
  hideOrders();
}
</script>

<template>
  <PrunButton v-if="state == 2" :primary="true" @click="unHide">Unhide</PrunButton>
  <div v-if="state == 1" :class="$style.container">
    <div>Production orders:</div>
    <div>Keep top 0 - {{ props.capacity }}?</div>
    <input
      v-model="keepCapacity"
      size="5"
      type="number"
      :min="0"
      :max="props.capacity"
      @input="keepCapacity = clamp(keepCapacity ?? 0, 0, props.capacity)" />
    <div>Queued orders:</div>
    <div>Keep top 0 - {{ props.slots }}?</div>
    <input
      v-model="keepSlots"
      size="5"
      type="number"
      :min="0"
      :max="props.slots"
      @input="keepSlots = clamp(keepSlots ?? 0, 0, props.slots)" />
    <PrunButton :primary="true" @click="hideOrders">Hide Orders</PrunButton>
    <PrunButton :primary="true" @click="state = 0">Cancel</PrunButton>
  </div>
  <PrunButton v-if="state == 0" :primary="true" @click="state = 1">Hide Orders</PrunButton>
</template>

<style module>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
