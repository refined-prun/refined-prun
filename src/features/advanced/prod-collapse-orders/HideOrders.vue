<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';

const props = defineProps<{
  hideOrdersInfo: number[];
  totalProd: number;
  totalQueue: number;
  setOrdersDisplay: (keepProdAmt: number, keepQueueAmt) => void;
  displayAllOrders: () => void;
}>();

const keepProdAmt = ref<number>();
const keepQueueAmt = ref<number>();
const state = ref<number>(0);

function validateProdInput() {
  const amt = Number(keepProdAmt.value);
  keepProdAmt.value = clamp(amt, 0, props.totalProd);
}

function validateQueueInput() {
  const amt = Number(keepQueueAmt.value);
  keepQueueAmt.value = clamp(amt, 0, props.totalQueue);
}

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val ?? max));
}

function unHide() {
  props.displayAllOrders();
  state.value = 0;
}

function setHideAmt() {
  const prodAmt = Number(keepProdAmt.value);
  const queueAmt = Number(keepQueueAmt.value);
  if (props.totalProd >= prodAmt && prodAmt >= 0 && props.totalQueue >= queueAmt && queueAmt >= 0) {
    props.setOrdersDisplay(prodAmt, queueAmt);
    state.value = 2;
  }
}

function openInput() {
  state.value = 1;
}
console.log(props.hideOrdersInfo);
if (props.hideOrdersInfo) {
  keepProdAmt.value = props.hideOrdersInfo[0];
  keepQueueAmt.value = props.hideOrdersInfo[1];
  setHideAmt();
}
</script>

<template>
  <PrunButton v-if="state == 2" :primary="true" @click="unHide">Unhide</PrunButton>
  <div v-if="state == 1">Production orders:</div>
  <div v-if="state == 1">Keep top 0 - {{ props.totalProd }}?</div>
  <input
    v-if="state == 1"
    v-model="keepProdAmt"
    size="5"
    type="number"
    :min="0"
    :max="props.totalProd"
    @input="validateProdInput" />
  <div v-if="state == 1">Queued orders:</div>
  <div v-if="state == 1">Keep top 0 - {{ props.totalQueue }}?</div>
  <input
    v-if="state == 1"
    v-model="keepQueueAmt"
    size="5"
    type="number"
    :min="0"
    :max="props.totalQueue"
    @input="validateQueueInput" />
  <PrunButton v-if="state == 1" :primary="true" @click="setHideAmt">Hide Orders</PrunButton>
  <PrunButton v-if="state == 0" :primary="true" @click="openInput">Hide Orders</PrunButton>
</template>

<style module></style>
