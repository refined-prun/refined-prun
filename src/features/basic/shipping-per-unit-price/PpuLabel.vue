<script setup lang="ts">
import { CurrencySymbols } from '@src/legacy';
import { fixed0 } from '@src/utils/format';
import { getMaterialByName } from '@src/infrastructure/prun-ui/i18n';

const { amountInput, currencyInput, materialName, totalPriceInput } = defineProps<{
  amountInput: string;
  currencyInput: string;
  materialName: string;
  totalPriceInput: string;
}>();

const material = computed(() => getMaterialByName(materialName));

const unit = computed(() => {
  if (!material.value) {
    return undefined;
  }
  const weight = material.value.weight;
  const volume = material.value.volume;
  return weight >= volume ? { symbol: 't', size: weight } : { symbol: 'm³', size: volume };
});

const amount = computed(() => {
  const amount = parseInt(amountInput, 10);
  return isFinite(amount) ? amount : undefined;
});

const totalSize = computed(() => {
  if (unit.value && amount.value !== undefined) {
    return fixed0(amount.value * unit.value.size);
  }

  return `-- `;
});

const totalPrice = computed(() => {
  const totalPrice = parseInt(totalPriceInput, 10);
  return isFinite(totalPrice) ? totalPrice : undefined;
});

const perUnit = computed(() => {
  if (unit.value && amount.value !== undefined && totalPrice.value !== undefined) {
    return fixed0(totalPrice.value / (amount.value * unit.value.size));
  }

  return '--';
});

const currency = computed(() => {
  return CurrencySymbols[currencyInput] ?? '';
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
