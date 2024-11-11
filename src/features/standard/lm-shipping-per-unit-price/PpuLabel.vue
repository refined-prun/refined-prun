<script setup lang="ts">
import { CurrencySymbols } from '@src/GameProperties';
import { computed } from 'vue';
import { fixed0 } from '@src/utils/format';
import { getMaterialByName } from '@src/infrastructure/prun-ui/i18n';

const props = defineProps({
  materialName: {
    type: String,
    required: true,
  },
  amountInput: {
    type: String,
    required: true,
  },
  totalPriceInput: {
    type: String,
    required: true,
  },
  currencyInput: {
    type: String,
    required: true,
  },
});

const material = computed(() => getMaterialByName(props.materialName));

const unit = computed(() => {
  if (!material.value) {
    return undefined;
  }
  const weight = material.value.weight;
  const volume = material.value.volume;
  return weight >= volume ? { symbol: 't', size: weight } : { symbol: 'm³', size: volume };
});

const amount = computed(() => {
  const amount = parseInt(props.amountInput, 10);
  return isFinite(amount) ? amount : undefined;
});

const totalSize = computed(() => {
  if (unit.value && amount.value) {
    return fixed0(amount.value * unit.value.size);
  }

  return `-- `;
});

const totalPrice = computed(() => {
  const totalPrice = parseInt(props.totalPriceInput, 10);
  return isFinite(totalPrice) ? totalPrice : undefined;
});

const perUnit = computed(() => {
  if (unit.value && amount.value && totalPrice.value) {
    return fixed0(totalPrice.value / (amount.value * unit.value.size));
  }

  return '--';
});

const currency = computed(() => {
  return CurrencySymbols[props.currencyInput] ?? '';
});
</script>

<template>
  <span>
    <template v-if="material">
      {{ totalSize }} {{ unit?.symbol }} | {{ currency }}{{ perUnit }}/{{ unit?.symbol }}
    </template>
    <template v-else>--</template>
  </span>
</template>
