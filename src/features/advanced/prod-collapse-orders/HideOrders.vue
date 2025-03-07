<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';

const props = defineProps<{
  totalProd: number;
  totalQueue: number;
  hideSomeOrders: (keepProdAmt: number, keepQueueAmt) => void;
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
    props.hideSomeOrders(prodAmt, queueAmt);
    state.value = 2;
  }
}
function openInput() {
  state.value = 1;
}
</script>

<template>
  <PrunButton v-if="state == 2" :primary="true" @click="unHide">UNHIDE</PrunButton>
  <input
    v-if="state == 1"
    v-model="keepProdAmt"
    size="8"
    type="number"
    :min="0"
    :max="props.totalProd"
    :placeholder="`Keep 0 - ${props.totalProd}?`"
    @input="validateProdInput" />
  <input
    v-if="state == 1"
    v-model="keepQueueAmt"
    size="8"
    type="number"
    :min="0"
    :max="props.totalQueue"
    :placeholder="`Keep 0 - ${props.totalQueue}?`"
    @input="validateQueueInput" />
  <PrunButton v-if="state == 1" :primary="true" @click="setHideAmt">HIDE ORDERS</PrunButton>
  <PrunButton v-if="state == 0" :primary="true" @click="openInput">HIDE ORDERS</PrunButton>
</template>

<style module></style>
