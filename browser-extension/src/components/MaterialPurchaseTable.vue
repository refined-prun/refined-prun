<script setup lang="ts">
import { fixed0, fixed2 } from '@src/utils/format';
import PrunLink from '@src/components/PrunLink.vue';
import MaterialIcon from '@src/components/MaterialIcon.vue';
import { computed, PropType } from 'vue';
import { settings } from '@src/store/settings';
import { calcMaterialAmountPrice } from '@src/fio/cx';
import { sortMaterialAmounts } from '@src/prun-api/data/materials';

const props = defineProps({
  materials: {
    type: Array as PropType<PrunApi.MaterialAmount[]>,
    required: true,
  },
});

const sorted = computed(() => sortMaterialAmounts(props.materials));

function calculateTotal(fn: (material: PrunApi.MaterialAmount) => number) {
  let total = 0;
  for (const material of sorted.value) {
    total += fn(material);
  }
  return total;
}

function formatPrice(price: number): string {
  return settings.fin.currency + fixed0(price);
}

function calculateWeight(amount: PrunApi.MaterialAmount) {
  return (amount.material?.weight ?? 0) * amount.amount;
}

function calculateVolume(amount: PrunApi.MaterialAmount) {
  return (amount.material?.volume ?? 0) * amount.amount;
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Material</th>
        <th>Cost</th>
        <th>Weight</th>
        <th>Volume</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="material in sorted" :key="material.material.ticker">
        <td><MaterialIcon small :ticker="material.material.ticker" :amount="material.amount" /></td>
        <td>{{ formatPrice(calcMaterialAmountPrice(material)) }}</td>
        <td>{{ fixed2(calculateWeight(material)) }}t</td>
        <td>{{ fixed2(calculateVolume(material)) }}m³</td>
        <td><PrunLink :command="`CXM ${material.material.ticker}`" /></td>
      </tr>
    </tbody>
    <tbody>
      <tr>
        <td>Total:</td>
        <td>{{ formatPrice(calculateTotal(calcMaterialAmountPrice)) }}</td>
        <td>{{ fixed2(calculateTotal(calculateWeight)) }}t</td>
        <td>{{ fixed2(calculateTotal(calculateVolume)) }}m³</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
tr > *:first-child {
  width: 0;
}
</style>
