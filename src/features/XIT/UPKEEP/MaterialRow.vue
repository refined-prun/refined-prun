<script setup lang="ts">
import { materialsStore } from '@src/infrastructure/prun-api/data/materials.ts';
import NumericInput from '@src/components/forms/NumericInput.vue';
import PrunButton from '@src/components/PrunButton.vue';
import MaterialIcon from '@src/components/MaterialIcon.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import { deleteUpkeep } from '@src/store/upkeeps.ts';

const { upkeep } = defineProps<{
  upkeep: UserData.Upkeep;
}>();

if (upkeep.matAmounts.length < 1) {
  upkeep.matAmounts.push({ material: materialsStore.getByTicker('RAT')!, amount: 10 });
}

const data = ref({
  ticker: upkeep.matAmounts[0].material.ticker,
  amount: upkeep.matAmounts[0].amount,
  days: upkeep.duration.millis / 1000 / 60 / 60 / 24,
});

watch(
  data,
  value => {
    upkeep.matAmounts[0].amount = value.amount;
    upkeep.matAmounts[0].material =
      materialsStore.getByTicker(value.ticker) ?? materialsStore.getByTicker('RAT')!;
    upkeep.duration.millis = value.days * 24 * 60 * 60 * 1000;
  },
  { deep: true },
);

const onDeleteClick = () => {
  deleteUpkeep(upkeep);
};
</script>

<template>
  <tr>
    <td :class="$style.materialContainer">
      <MaterialIcon size="inline-table" :ticker="data.ticker" />
    </td>
    <td :class="$style.tickerCell">
      <div :class="[C.forms.input, $style.inline]">
        <TextInput v-model="data.ticker" />
      </div>
    </td>
    <td :class="$style.amountCell">
      <div :class="[C.forms.input, $style.inline]">
        <NumericInput v-model="data.amount" />
      </div>
    </td>
    <td :class="$style.daysCell">
      <div :class="[C.forms.input, $style.inline]">
        <NumericInput v-model="data.days" />
      </div>
    </td>
    <td :class="$style.rateCell">
      {{ data.amount >= 0 ? '+' : '' }}{{ Math.round((data.amount / data.days) * 100) / 100 }}
    </td>
    <td>
      <PrunButton danger @click="onDeleteClick">DEL</PrunButton>
    </td>
  </tr>
</template>

<style module>
.inline {
  display: inline-block;
}

.materialContainer {
  width: 32px;
  padding: 0;
}

.tickerCell * {
  width: 40px;
}

.amountCell * {
  width: 60px;
}

.daysCell * {
  width: 40px;
}

.rateCell * {
  width: 80px;
}
</style>
