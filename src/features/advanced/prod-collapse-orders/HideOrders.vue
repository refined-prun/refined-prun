<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';

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

function validateProdInput() {
  const amt = Number(keepCapacity.value);
  keepCapacity.value = clamp(amt, 0, props.capacity);
}

function validateQueueInput() {
  const amt = Number(keepSlots.value);
  keepSlots.value = clamp(amt, 0, props.slots);
}

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val ?? max));
}

function unHide() {
  props.displayAllOrders();
  state.value = 0;
}

function hideOrders() {
  if (keepCapacity.value || keepSlots.value) {
    const prodAmt = Number(keepCapacity.value);
    const queueAmt = Number(keepSlots.value);
    if (props.capacity >= prodAmt && prodAmt >= 0 && props.slots >= queueAmt && queueAmt >= 0) {
      props.setOrdersDisplay(prodAmt, queueAmt);
      state.value = 2;
    }
  } else {
    state.value = 0;
  }
}

function openHideSettings() {
  state.value = 1;
}
if (props.headerOrdersInfo) {
  keepCapacity.value = props.headerOrdersInfo[0];
  keepSlots.value = props.headerOrdersInfo[1];
  hideOrders();
}
</script>

<template>
  <PrunButton v-if="state == 2" :primary="true" @click="unHide">Unhide</PrunButton>
  <div v-if="state == 1">
    <div>Production orders:</div>
    <div>Keep top 0 - {{ props.capacity }}?</div>
    <input
      v-model="keepCapacity"
      size="5"
      type="number"
      :min="0"
      :max="props.capacity"
      @input="validateProdInput" />
    <div>Queued orders:</div>
    <div>Keep top 0 - {{ props.slots }}?</div>
    <input
      v-model="keepSlots"
      size="5"
      type="number"
      :min="0"
      :max="props.slots"
      @input="validateQueueInput" />
    <PrunButton :primary="true" @click="hideOrders">Hide Orders</PrunButton>
    <PrunButton :primary="true" @click="unHide">Cancel</PrunButton>
  </div>
  <PrunButton v-if="state == 0" :primary="true" @click="openHideSettings">Hide Orders</PrunButton>
</template>

<style module></style>
