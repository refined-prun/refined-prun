<script setup lang="ts">
import { computed, PropType } from 'vue';
import { friendlyConditionText, isConditionFulfilled } from '@src/features/XIT/CONTS/utils';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';

const props = defineProps({
  condition: {
    type: Object as PropType<PrunApi.ContractCondition>,
    required: true,
  },
});

const isFulfilled = computed(() => isConditionFulfilled(props.condition));
const iconClass = computed(() => ({
  [PrunCss.ColoredValue.positive]: isFulfilled.value,
  [PrunCss.ColoredValue.negative]: !isFulfilled.value,
}));
const icon = computed(() => (isFulfilled.value ? '✓' : '✗'));
</script>

<template>
  <div>
    <span :class="iconClass">{{ icon }}&nbsp;{{ friendlyConditionText(condition.type) }}</span>
  </div>
</template>
