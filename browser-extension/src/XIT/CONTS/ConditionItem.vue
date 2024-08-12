<script setup lang="ts">
import { computed, PropType } from 'vue';
import { TextColors } from '@src/Style';
import { friendlyConditionText, isConditionFulfilled } from '@src/XIT/CONTS/utils';

const props = defineProps({
  condition: {
    type: Object as PropType<PrunApi.ContractCondition>,
    required: true,
  },
});

const isFulfilled = computed(() => isConditionFulfilled(props.condition));
const color = computed(() => (isFulfilled.value ? TextColors.Success : TextColors.Failure));
const icon = computed(() => (isFulfilled.value ? '✓' : '✗'));
</script>

<template>
  <div>
    <span :style="{ color, fontWeight: 'bold' }">{{ icon }}&nbsp;</span>
    <span>{{ friendlyConditionText(condition.type) }}</span>
  </div>
</template>
