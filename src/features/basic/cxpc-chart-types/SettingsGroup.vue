<script setup lang="ts">
import RadioGroupContainer from '@src/components/RadioGroupContainer.vue';
import RadioItem from '@src/components/forms/RadioItem.vue';
import { userData } from '@src/store/user-data';

const { chartType, onChange } = defineProps<{
  chartType: UserData.ExchangeChartType | undefined;
  onChange: (type: UserData.ExchangeChartType) => void;
}>();

function createToggleModel(type: UserData.ExchangeChartType) {
  return computed({
    get: () => (chartType ?? userData.settings.defaultChartType) === type,
    set: value => {
      if (value) {
        onChange(type);
      }
    },
  });
}

const smooth = createToggleModel('SMOOTH');
const aligned = createToggleModel('ALIGNED');
const raw = createToggleModel('RAW');
</script>

<template>
  <RadioGroupContainer horizontal>
    <RadioItem v-model="smooth" horizontal>smooth</RadioItem>
    <RadioItem v-model="aligned" horizontal>aligned</RadioItem>
    <RadioItem v-model="raw" horizontal>raw</RadioItem>
  </RadioGroupContainer>
</template>
